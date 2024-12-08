from app import create_app, db
from models import Faculty, Admin, AllocatedCourse

app = create_app()

def populate_database():
    with app.app_context():
        db.drop_all()
        db.create_all()

        faculties = [
            {'username': 'SU1001', 'name': 'Anurag Rana', 'designation': 'Professor', 'key': '2b2be85fa0c34154beb1809e1668047a2a0b1872bc2be7b61ffc22888cd3f643', 'vote_status': 0},
            {'username': 'SU1002', 'name': 'Archit Joshi', 'designation': 'Associate Professor', 'key': 'f98472ca188a3b516b5e882bccb06262cb3b76c913bdc21d4266c24ff4eacbdb', 'vote_status': 0},
            {'username': 'SU1003', 'name': 'Abhishek Tomar', 'designation': 'Assistant Professor', 'key': 'cdba8b427acbee3ac70a02cfedee70f9b138da6c5d0c6d018b25b55c37ae24e7', 'vote_status': 0},
            {'username': 'SU1004', 'name': 'Gaurav Gupta', 'designation': 'Teaching/Research Associate', 'key': 'abf88b3c65a0dff4ed8d070316003045f8c392cc6ea90c660d5f7a808a79d022', 'vote_status': 0},
            {'username': 'SU1005', 'name': 'Kritika Rana', 'designation': 'Assistant Professor', 'key': 'd8169d32dad294821d9cdf0c174d9a0ef16a0be7dd2c9303bf11afc09bd2eba6', 'vote_status': 0},
        ]

        for faculty in faculties:
            new_faculty = Faculty(
                username=faculty["username"],
                name=faculty["name"],
                designation=faculty["designation"],
                key=faculty["key"],
                vote_status=faculty["vote_status"],
            )
            db.session.add(new_faculty)

        admin = Admin(username="admin", key='ea9ed2265faf0332780d27da99d2f829fcf8c1918ae8ab603e5240fb25a9c0a4')
        db.session.add(admin)
        db.session.commit()

        print("Database populated successfully!")


if __name__ == "__main__":
    populate_database()
