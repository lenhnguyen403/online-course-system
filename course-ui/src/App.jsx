import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import MainLayout from './layouts/DefaultLayout/MainLayout'
import AdminDashboard from './pages/Dashboard/AdminDashboard'
import TeacherLayout from './pages/Teacher/TeacherLayout'
import StudentLayout from './pages/Student/StudentLayout'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<MainLayout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/teacher/login' element={<Login />} />
        <Route path='/dashboard' element={<AdminDashboard />} />
        <Route path='/teacher' element={<TeacherLayout />} />
        <Route path='/student' element={<StudentLayout />} />
      </Routes>
    </>
  )
}

export default App
