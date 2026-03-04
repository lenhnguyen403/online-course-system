import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login/Login'
import DashboardHome from './pages/Dashboard/DashboardHome'
import CreateUser from './pages/CreateUser/CreateUser'
import UserList from './pages/Users/UserList'
import UserDetail from './pages/Users/UserDetail'
import SubjectList from './pages/Subjects/SubjectList'
import CourseList from './pages/Courses/CourseList'
import CreateCourse from './pages/Courses/CreateCourse'
import CourseDetail from './pages/Courses/CourseDetail'
import CourseContent from './pages/Courses/CourseContent'
import ClassList from './pages/Classes/ClassList'
import CreateClass from './pages/Classes/CreateClass'
import ClassDetail from './pages/Classes/ClassDetail'
import ExamResultsPage from './pages/Classes/ExamResultsPage'
import ExamQuestionsPage from './pages/Classes/ExamQuestionsPage'
import PaymentList from './pages/Payments/PaymentList'
import CreatePayment from './pages/Payments/CreatePayment'
import JournalList from './pages/Journals/JournalList'
import ReportsPage from './pages/Reports/ReportsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="subjects" element={<SubjectList />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/create" element={<CreateCourse />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="courses/:id/content" element={<CourseContent />} />
        <Route path="classes" element={<ClassList />} />
        <Route path="classes/create" element={<CreateClass />} />
        <Route path="classes/:id" element={<ClassDetail />} />
        <Route path="classes/:classId/exams/:examId/results" element={<ExamResultsPage />} />
        <Route path="classes/:classId/exams/:examId/questions" element={<ExamQuestionsPage />} />
        <Route path="payments" element={<PaymentList />} />
        <Route path="payments/create" element={<CreatePayment />} />
        <Route path="journals" element={<JournalList />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
