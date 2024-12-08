import json
from flask import Blueprint, request, jsonify, make_response
from models import Faculty, FacultyResponse, Admin, AllocatedCourse
import csv
from app import db
from io import StringIO

faculty_routes = Blueprint("faculty_routes", __name__)
admin_routes = Blueprint("admin_routes", __name__)

@faculty_routes.route("/api/validate-faculty", methods=["POST"])
def validate_faculty():
    data = request.json
    username = data.get("username")
    key = data.get("key")
    name = data.get("name")
    designation = data.get("designation")

    faculty = Faculty.query.filter_by(username=username, key=key, name=name, designation=designation).first()

    if faculty:
        if faculty.vote_status: 
            return jsonify({
                "status": "error",
                "message": "You have already submitted your course preferences. Thank you!"
            }), 403
        return jsonify({"status": "success", "faculty": {"name": faculty.name, "designation": faculty.designation}})
    else:
        return jsonify({"status": "error", "message": "Invalid details provided"}), 401

@faculty_routes.route("/api/submit-preferences", methods=["POST"])
def submit_preferences():
    data = request.json
    username = data.get("username")
    preferences = data.get("preferences")

    if not preferences or len(preferences) != 7:
        return jsonify({"status": "error", "message": "You must select exactly 7 preferences."}), 400

    faculty = Faculty.query.filter_by(username=username).first()

    if not faculty:
        return jsonify({"status": "error", "message": "Faculty not found."}), 404

    if faculty.vote_status:  
        return jsonify({"status": "error", "message": "You have already submitted your preferences."}), 403

    response = FacultyResponse(faculty_id=faculty.id, preferences=json.dumps(preferences))
    faculty.vote_status = True 
    db.session.add(response)
    db.session.commit()

    return jsonify({"status": "success", "message": "Preferences submitted successfully!"})

@admin_routes.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.json
    username = data.get("username")
    key = data.get("key") 

    admin = Admin.query.filter_by(username=username, key=key).first()
    if admin:
        return jsonify({"status": "success", "message": "Login successful"})
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

@admin_routes.route("/api/admin/reset-db", methods=["POST"])
def reset_db():
    FacultyResponse.query.delete() 
    faculties = Faculty.query.all()
    for faculty in faculties:
        faculty.allocated_hours = 0
        faculty.assigned_courses = None
    db.session.commit()
    return jsonify({"status": "success", "message": "Database reset successful"})

@admin_routes.route("/api/admin/close-entries", methods=["POST"])
def close_entries():
    faculties = Faculty.query.all()
    for faculty in faculties:
        faculty.vote_status = 1 
    db.session.commit()
    return jsonify({"status": "success", "message": "Entries are now closed"})

@admin_routes.route("/api/admin/allocate-courses", methods=["POST"])
def allocate_courses():
    courses = []
    with open('courses.csv', 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            courses.append({
                "program": row["Program"],
                "semester": int(row["Semester"]),
                "course_name": row["Course Name"],
                "credits": int(row["Credits"]),
                "weekly_slots": int(row["Weekly Slots"]),
                "groups": int(row["Groups"]),
                "required_hours": int(row["Weekly Slots"]) * int(row["Groups"])
            })

    faculties = Faculty.query.order_by(
        db.case(
            (Faculty.designation == 'Professor', 1),
            (Faculty.designation == 'Associate Professor', 2),
            (Faculty.designation == 'Assistant Professor', 3),
            (Faculty.designation == 'Teaching/Research Associate', 4)
        )
    ).all()

    allocations = []
    for faculty in faculties:
        faculty_allocated_hours = 0
        preferences = FacultyResponse.query.filter_by(faculty_id=faculty.id).first()
        if not preferences:
            continue

        pref_list = json.loads(preferences.preferences)
        for pref in pref_list:
            for course in courses:
                if course["course_name"] == pref and course["required_hours"] + faculty_allocated_hours <= 40:
                    allocation = AllocatedCourse(
                        faculty_id=faculty.id,
                        course_name=course["course_name"],
                        program=course["program"],
                        semester=course["semester"],
                        credits=course["credits"],
                        weekly_slots=course["weekly_slots"],
                        groups=course["groups"],
                        allocated_hours=course["required_hours"]
                    )
                    db.session.add(allocation)
                    allocations.append(allocation)
                    
                    faculty_allocated_hours += course["required_hours"]
                    courses.remove(course)
                    break

        if len([a for a in allocations if a.faculty_id == faculty.id]) < 2:
            for course in courses:
                if course["required_hours"] + faculty_allocated_hours <= 40:
                    allocation = AllocatedCourse(
                        faculty_id=faculty.id,
                        course_name=course["course_name"],
                        program=course["program"],
                        semester=course["semester"],
                        credits=course["credits"],
                        weekly_slots=course["weekly_slots"],
                        groups=course["groups"],
                        allocated_hours=course["required_hours"]
                    )
                    db.session.add(allocation)
                    allocations.append(allocation)
                    
                    faculty_allocated_hours += course["required_hours"]
                    courses.remove(course)
                    if len([a for a in allocations if a.faculty_id == faculty.id]) >= 2:
                        break

    db.session.commit()
    return jsonify({"status": "success", "message": "Courses allocated successfully!", "allocations": len(allocations)})

@admin_routes.route("/api/admin/get-allocations", methods=["GET"])
def get_allocations():
    allocated_courses = AllocatedCourse.query.all()
    allocations = [
        {
            "faculty_name": Faculty.query.get(course.faculty_id).name,
            "course_name": course.course_name,
            "program": course.program,
            "semester": course.semester,
            "credits": course.credits,
            "weekly_slots": course.weekly_slots,
            "groups": course.groups,
            "allocated_hours": course.allocated_hours,
        }
        for course in allocated_courses
    ]

    assigned_courses = [course.course_name for course in allocated_courses]
    with open("courses.csv", "r") as file:
        reader = csv.DictReader(file)
        all_courses = [
            row for row in reader if row["Course Name"] not in assigned_courses
        ]

    unassigned_courses = [
        {
            "program": course["Program"],
            "semester": int(course["Semester"]),
            "course_name": course["Course Name"],
            "credits": int(course["Credits"]),
            "weekly_slots": int(course["Weekly Slots"]),
            "groups": int(course["Groups"]),
        }
        for course in all_courses
    ]

    return jsonify({"status": "success", "allocations": allocations, "unassigned_courses": unassigned_courses})

@admin_routes.route("/api/admin/export-allocations", methods=["GET"])
def export_allocations():
    try:
        allocated_courses = AllocatedCourse.query.options(db.joinedload(AllocatedCourse.faculty)).all()
        assigned_courses = [course.course_name for course in allocated_courses]
        with open("courses.csv", "r") as file:
            reader = csv.DictReader(file)
            all_courses = [
                row for row in reader if row["Course Name"] not in assigned_courses
            ]
        unassigned_courses = [
        {
            "program": course["Program"],
            "semester": int(course["Semester"]),
            "course_name": course["Course Name"],
            "credits": int(course["Credits"]),
            "weekly_slots": int(course["Weekly Slots"]),
            "groups": int(course["Groups"]),
        }
        for course in all_courses
    ]
        print(unassigned_courses)

        allocated_csv = StringIO()
        writer = csv.writer(allocated_csv)
        writer.writerow(["Faculty Name", "Course Name", "Program", "Semester", "Credits", "Weekly Slots", "Groups", "Allocated Hours"])
        for course in allocated_courses:
            writer.writerow([
                course.faculty.name if course.faculty else 'Unassigned', 
                course.course_name, course.program,
                course.semester, course.credits, course.weekly_slots,
                course.groups, course.allocated_hours
            ])

        unassigned_csv = StringIO()
        writer = csv.writer(unassigned_csv)
        writer.writerow(["Program", "Semester", "Course Name", "Credits", "Weekly Slots", "Groups"])
        for course in unassigned_courses:
            writer.writerow([
                course['program'], course['semester'], course['course_name'],
                course['credits'], course['weekly_slots'], course['groups']
            ])

        response = make_response({
            "allocated_csv": allocated_csv.getvalue(),
            "unassigned_csv": unassigned_csv.getvalue()
        })
        response.headers["Content-Disposition"] = "attachment; filename=allocations.csv"
        response.headers["Content-Type"] = "text/csv"

        return response
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": "Failed to export allocations."}), 500
