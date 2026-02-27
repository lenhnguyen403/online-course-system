import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import MainLayout from './layouts/DefaultLayout/MainLayout'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<MainLayout />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
