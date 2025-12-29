# Task Manager Application (PERN Stack)

A full-stack Task Manager application built using the **PERN stack**.  
This repository currently contains the **backend implementation**.  
The **React frontend will be added in a future phase**.

---

## Features

### Backend (Implemented)
- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication
- Authorization using middleware
- Task CRUD operations
- User-specific task access (ownership enforced)
- PostgreSQL with constraints and relations

### Frontend (Planned)
- React-based user interface
- Authentication flow (login/register)
- Protected routes
- Task creation, editing, and deletion

---

## Tech Stack

### Backend
- Node.js
- Express (ES Modules)
- PostgreSQL
- JWT (Authentication)
- bcrypt (Password hashing)
- pg (Database client)
- dotenv (Environment variables)

### Frontend (Planned)
- React
- React Router
- Axios / Fetch API

---

## Project Structure

server/
├── src/
│ ├── app.js
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── auth.controller.js
│ │ └── task.controller.js
│ ├── routes/
│ │ ├── auth.routes.js
│ │ └── task.routes.js
│ ├── middlewares/
│ │ └── auth.middleware.js
│
├── .env
├── package.json
└── README.md


---

## Authentication Flow

1. User registers with email and password
2. Password is hashed using bcrypt
3. User logs in and receives a JWT
4. JWT is sent via `Authorization: Bearer <token>`
5. Middleware verifies the token
6. Controllers use the authenticated user identity to enforce access control

---

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks (Protected)
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

---

## Running the Backend Locally

1. Clone the repository
2. Install dependencies
   npm install
3. Create an .env file as per the structure
    Contents of .env
        PORT=your_port_number
        DATABASE_URL=your_postgresql_connection_string
        JWT_SECRET=your_jwt_secret
4. Start the server
    npm run dev


👨‍💻
## Author
    Sai Charan
    Second-year CSE student, NIT Andhra Pradesh
    Focused on building scalable full-stack applications.
    