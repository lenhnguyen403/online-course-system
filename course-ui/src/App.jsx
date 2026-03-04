import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/Login/ForgotPassword'
import ResetPassword from './pages/Login/ResetPassword'
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
import StudentCourseContent from './pages/Student/StudentCourseContent'
import StudentPayments from './pages/Student/StudentPayments'
import StudentExams from './pages/Student/StudentExams'
import StudentAssignments from './pages/Student/StudentAssignments'
import StudentSubmitAssignment from './pages/Student/StudentSubmitAssignment'
import StudentViewSubmission from './pages/Student/StudentViewSubmission'
import StudentQuiz from './pages/Student/StudentQuiz'
import StudentProfile from './pages/Student/StudentProfile'
import TeacherAssignmentSubmissions from './pages/Teacher/TeacherAssignmentSubmissions'
import StudentCalendar from './pages/Student/StudentCalendar'
import TeacherCalendar from './pages/Teacher/TeacherCalendar'
import StudentAnnouncements from './pages/Student/StudentAnnouncements'
import StudentNotifications from './pages/Student/StudentNotifications'
import StudentClassChat from './pages/Student/StudentClassChat'
import StudentCertificates from './pages/Student/StudentCertificates'
import StudentCertificateView from './pages/Student/StudentCertificateView'
import StudentLearningReport from './pages/Student/StudentLearningReport'
import TeacherClassLearningReport from './pages/Teacher/TeacherClassLearningReport'
import TeacherPendingSubmissions from './pages/Teacher/TeacherPendingSubmissions'
import StudentMyCourses from './pages/Student/StudentMyCourses'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/teacher/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClassList />} />
        <Route path="classes/:classId" element={<TeacherClassDetail />} />
        <Route path="classes/:classId/assignments/:assignmentId" element={<TeacherAssignmentSubmissions />} />
        <Route path="classes/:classId/learning-report" element={<TeacherClassLearningReport />} />
        <Route path="classes/:classId/students/:studentId" element={<TeacherStudentDetail />} />
        <Route path="pending-submissions" element={<TeacherPendingSubmissions />} />
        <Route path="calendar" element={<TeacherCalendar />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="classes" element={<StudentClasses />} />
        <Route path="classes/:classId/chat" element={<StudentClassChat />} />
        <Route path="my-courses" element={<StudentMyCourses />} />
        <Route path="courses/:courseId" element={<StudentCourseContent />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<StudentCourseContent />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="classes/:classId/assignments/:assignmentId/submit" element={<StudentSubmitAssignment />} />
        <Route path="classes/:classId/assignments/:assignmentId/submissions/:submissionId" element={<StudentViewSubmission />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="exams/:examId/quiz" element={<StudentQuiz />} />
        <Route path="calendar" element={<StudentCalendar />} />
        <Route path="announcements" element={<StudentAnnouncements />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="certificate/:courseId" element={<StudentCertificateView />} />
        <Route path="learning-report" element={<StudentLearningReport />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>
    </Routes>
  )
}

export default App
