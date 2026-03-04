import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import MainLayout from './layouts/DefaultLayout/MainLayout'
import TeacherLayout from './pages/Teacher/TeacherLayout'
import TeacherDashboard from './pages/Teacher/TeacherDashboard'
import TeacherClassList from './pages/Teacher/TeacherClassList'
import TeacherClassDetail from './pages/Teacher/TeacherClassDetail'
import TeacherStudentDetail from './pages/Teacher/TeacherStudentDetail'
import TeacherProfile from './pages/Teacher/TeacherProfile'
import StudentLayout from './pages/Student/StudentLayout'
import StudentDashboard from './pages/Student/StudentDashboard'
import StudentClasses from './pages/Student/StudentClasses'
import StudentPayments from './pages/Student/StudentPayments'
import StudentExams from './pages/Student/StudentExams'
import StudentProfile from './pages/Student/StudentProfile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/teacher/login" element={<Login />} />
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClassList />} />
        <Route path="classes/:classId" element={<TeacherClassDetail />} />
        <Route path="classes/:classId/students/:studentId" element={<TeacherStudentDetail />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="classes" element={<StudentClasses />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>
    </Routes>
  )
}

export default App
