import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { FaBars } from "react-icons/fa6";

const Header = () => {
    const navigate = useNavigate();
    const handleTeacherNavigate = () => {
        navigate('/teacher/login')
    }
    return (
        <header className='shadow-md'>
            <div className='flex items-center justify-between px-4 md:px-7.5'>
                <Link className='max-w-[15%] md:max-w-[10%] lg:max-w-[5%]'
                    to='/'
                >
                    <Logo />
                </Link>
                <div className='hidden lg:block'>
                    <button type="button"
                        className='bg-orange-500 text-white hover:bg-orange-600 
                            px-4 py-2 mr-4 lg:cursor-pointer rounded'
                        onClick={handleTeacherNavigate}
                    >
                        Giảng viên
                    </button>
                    <Link to='/login'
                        className='hover:text-orange-500 transition-colors'
                    >
                        Đăng nhập
                    </Link>
                </div>

                {/* Icon Bars for Small & Medium Screen */}
                <FaBars className='lg:hidden text-lg' />
            </div>
        </header>
    )
}

export default Header
