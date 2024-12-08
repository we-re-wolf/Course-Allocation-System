---

# **Course Allocation System** 🎓✨  
A modern web application for managing course allocations and faculty preferences with efficiency and ease. This system provides a seamless interface for faculty to submit course preferences and administrators to allocate courses intelligently.  

---

## **🚀 Features**
- **Faculty Module:** Submit course preferences with a user-friendly interface.  
- **Admin Module:**  
  - View faculty preferences.  
  - Allocate courses to faculty based on preferences.  
  - Export allocations and unassigned courses as CSV files.  
- **Responsive UI:** Built with modern React.js components.  
- **Robust Backend:** Powered by Flask and SQLAlchemy for database management.  
- **Export Functionality:** Download course allocations and unassigned courses in a structured CSV format.  

---

## **🖼️ Screenshots**
| Faculty Dashboard | Admin Allocations Page |
|-------------------|-------------------------|
| ![Faculty Dashboard Screenshot](https://github.com/we-re-wolf/Course-Allocation-System/blob/main/images/Screenshot%202024-12-08%20173209.png) | ![Admin Allocations Page Screenshot](https://github.com/we-re-wolf/Course-Allocation-System/blob/main/images/admin.png) |

---

## **🛠️ Tech Stack**
- **Frontend:** React.js, CSS Modules  
- **Backend:** Flask, SQLAlchemy  
- **Database:** SQLite (Development), PostgreSQL/MySQL (Production-ready)  
- **Others:** CSV export functionality, RESTful APIs  

---

## **📂 Project Structure**
```
CourseAllocationSystem/
│
├── backend/                # Flask API and backend logic
│   ├── app.py              # Main Flask application
│   ├── models.py           # SQLAlchemy models
│   ├── routes.py           # API routes
│   ├── populate.py         # Populate Database
│   └── courses.csv         # Course List
├── src/                
│   │   ├── components/     # React components
│   │   ├── pages/          # Application pages
│   │   └── App.js          # Main React entry
│   └── public/             # Static assets
│
├── README.md               # Project documentation
└── requirements.txt        # Python dependencies
```

---

## **📦 Installation & Setup**
Follow these steps to get the application up and running on your local machine.

### **Prerequisites**
- Python 3.8 or higher  
- Node.js (for React frontend)  
- npm or yarn  
- Git  

---

### **Backend Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/we-re-wolf/course-allocation-system.git
   cd course-allocation-system/backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

5. Run the Flask development server:
   ```bash
   flask run
   ```
   The backend server will be available at `http://localhost:5000`.

---

### **Frontend Setup**
1. Navigate to the frontend directory:
   ```bash
   cd ../src
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`.

---

## **⚙️ Running the Application**
1. Start the backend server:
   ```bash
   cd backend
   flask run
   ```

2. Start the frontend server:
   ```bash
   cd src
   npm start
   ```

3. Open your browser and visit `http://localhost:3000` to interact with the application.

---

## **📤 Deployment**
- For production, use **Gunicorn** or **uWSGI** with **Nginx** for the backend.  
- Build the React frontend using `npm run build` and serve it using **Nginx** or any static file hosting service.  
- Use a robust database like PostgreSQL or MySQL.  

---

## **🤝 Contribution**
Contributions are welcome! Feel free to fork the repository and submit a pull request.  

1. Fork the repo.  
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## **📄 License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **✨ Acknowledgments**
- Thanks to the OpenAI community for assistance during development.  
- Inspired by modern course management systems.  

---
