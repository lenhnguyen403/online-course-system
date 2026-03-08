# F5 Education

## Summary

**F5 Education** is a full-stack education center management system built for training centers. It supports four user roles—**Admin**, **Instructor**, **Student**, and **Academic Staff**—and covers account management, classes, enrollments, grades, tuition status, and daily logs.

The system consists of a REST API backend and two web applications: an **Admin Dashboard** for administration and a **Course Portal** for instructors, students, and academic staff.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), JWT (access + refresh), bcrypt, Nodemailer, Cloudinary, Redis (ioredis), ExcelJS, node-cron, Zod, Helmet, Winston |
| **Admin UI** | React 19, Vite 7, Tailwind CSS 4, React Router 6, Zustand, Axios, React Hook Form, Yup, Recharts, React Toastify |
| **Course UI** | React 19, Vite 7, Tailwind CSS 4, React Router 6, Zustand, Axios, React Hook Form, Yup, Recharts, React Toastify |

**Project structure**

```
online-course-system/
├── course-server/    # REST API (Express + MongoDB)
├── admin-ui/         # Admin dashboard (React)
├── course-ui/        # Portal for Instructor / Student / Academic Staff (React)
└── README.md
```

---

## Features

### Admin
- Create accounts for Instructors, Students, and Academic Staff (email, password 6–8 chars, full name, phone, DOB, address, identity, role).
- Optional: send credentials by email after account creation.
- Statistics: total students per instructor.
- View average grades by class; charts for class/student performance.
- Monthly snapshot of instructor data (ID, name, class count, student count).
- Add subjects (SubjectId, SubjectName) with validation.
- Optional: automated email reminder for tuition payment 3 days before due date.

### Instructor
- View list of assigned classes.
- View and filter students in a class (StudentId, FullName, Email, Phone, Status).
- Student statuses: *Đang học*, *Chờ chuyển lớp*, *Thôi học*, *Đình chỉ*.
- View detailed profile of a student in a class.
- Write daily class logs (date, instructor name, content — date and author auto-filled).
- Write daily logs per student (same rules).

### Student
- View tuition status (paid / unpaid) and next payment due.
- View tuition payment history.
- View test scores by exam period.

### Academic Staff
- Update student grades by class and subject.
- System computes average of theory and practice scores.
- Update student status: *Đang học*, *Chờ chuyển lớp*, *Thôi học*, *Đình chỉ*.

---

## Installation

### Prerequisites
- **Node.js** — LTS version recommended (v18+).
- **MongoDB** — local or remote instance.
- **Optional:** Redis (caching), SMTP account (emails), Cloudinary (file uploads).

### 1. Clone and install dependencies

```bash
# Clone repository
git clone https://github.com/lenhnguyen403/online-course-system.git

# Backend
cd course-server && npm install

# Admin UI (in another terminal)
cd admin-ui && npm install

# Course UI (in another terminal)
cd course-ui && npm install
```

### 2. Run the application

Start the API first, then the frontends:

```bash
# Terminal 1 — Backend (default: http://localhost:3003)
cd course-server && npm run dev

# Terminal 2 — Admin dashboard
cd admin-ui && npm run dev

# Terminal 3 — Course portal
cd course-ui && npm run dev
```

| Package       | Command         | Description        |
|---------------|-----------------|--------------------|
| course-server | `npm run dev`   | Dev server (nodemon) |
| course-server | `npm start`     | Production server  |
| admin-ui      | `npm run dev`   | Vite dev server    |
| admin-ui      | `npm run build` | Production build   |
| course-ui     | `npm run dev`   | Vite dev server    |
| course-ui     | `npm run build` | Production build   |

---

