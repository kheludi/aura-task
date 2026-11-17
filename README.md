# ✨ Aura Task - Futuristic Task Management System

![Aura Task Banner](https://via.placeholder.com/1200x400/0a0a0f/8b5cf6?text=Aura+Task+-+Stay+Organized,+Code+Better)

Aura Task is a full-stack, production-ready task management application designed to streamline your workflow. Built with a futuristic, glassmorphism UI, it features a seamless Light/Dark mode toggle, real-time drag-and-drop task management, and a comprehensive Admin Command Center.

## 🔗 Live Demo
- **Frontend (Vercel):** [https://aura-task-five.vercel.app/](https://aura-task1.onrender.com/api/health)
- **Backend API (Render):** [[https://aura-task1.onrender.com](https://aura-task1.onrender.com)
*(Note: The backend is hosted on Render's free tier, so the first login might take 30-60 seconds to wake up the server).*

---

## 📸 Screenshots


### Dark Mode Dashboard
<img width="1887" height="1003" alt="image" src="https://github.com/user-attachments/assets/4ecae2da-f156-463e-91a5-9747b8cc10c0" />


### Light Mode Dashboard
<img width="1878" height="973" alt="image" src="https://github.com/user-attachments/assets/0b7aaccf-59a4-4a3a-b7fc-5f3235bb0b12" />


### Admin Command Center
<img width="1870" height="997" alt="image" src="https://github.com/user-attachments/assets/09c1c595-b755-4ae6-ae10-20956c26d8b2" />


---

## 🚀 Key Features

- **🔐 Secure Authentication:** User registration and login using JWT (JSON Web Tokens) and Bcrypt password hashing.
- **🎨 Modern UI/UX:** A stunning glassmorphism design with a fully responsive, custom Light/Dark mode toggle.
- **🖱️ Drag & Drop:** Seamlessly move tasks between "To Do", "In Progress", and "Completed" columns using `@dnd-kit`.
- **⏰ Smart Overdue Logic:** Tasks automatically lock and move to the "Overdue" column when their due date passes.
- **👑 Admin Panel:** A dedicated Command Center for administrators to view system stats, manage user roles, suspend accounts, and sort users dynamically.
- **🔍 Filters & Sorting:** Filter tasks by priority and category, and search for specific tasks in real-time.
- **☁️ Cloud Database:** Fully integrated with a remote PostgreSQL database.

---

## 💻 Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS (Custom Light/Dark themes)
- `@dnd-kit` (Drag and Drop)
- React Router DOM
- Axios & React Hot Toast
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- JSON Web Token (JWT)
- Bcrypt.js
- PostgreSQL (pg)
- Express Validator

**Database & Deployment:**
- Neon (PostgreSQL Database)
- Render (Backend Hosting)
- Vercel (Frontend Hosting)

---

## ⚙️ Local Setup & Installation

If you want to run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/kheludi/aura-task.git
cd aura-task
```
### 2. Setup the Backend
```bash
cd backend
npm install
```
### Create a .env file in the backend folder and add your environment variables:
```bash
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```
### Start the backend server:
```bash
npm run dev
```
### 3. Setup the Frontend
Open a new terminal, go to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
The app will be running at http://localhost:3000.

### 👤 Author
Khalid Muhammed

GitHub: @kheludi

LinkedIn: soon

Built with ❤️ for modern productivity.
