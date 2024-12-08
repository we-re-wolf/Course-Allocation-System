from app import db

class Faculty(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    key = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(50), nullable=False)
    vote_status = db.Column(db.Boolean, default=False) 

class FacultyResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    faculty_id = db.Column(db.Integer, db.ForeignKey('faculty.id'), nullable=False)
    preferences = db.Column(db.Text, nullable=False)  
    timestamp = db.Column(db.DateTime, default=db.func.now()) 

class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    key = db.Column(db.String(100), nullable=False) 

class AllocatedCourse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    faculty_id = db.Column(db.Integer, db.ForeignKey('faculty.id'), nullable=False)
    course_name = db.Column(db.String(100), nullable=False)
    program = db.Column(db.String(50), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    weekly_slots = db.Column(db.Integer, nullable=False)
    groups = db.Column(db.Integer, nullable=False)
    allocated_hours = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())
    faculty = db.relationship('Faculty', backref=db.backref('allocated_courses', lazy=True))
