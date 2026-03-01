import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../components/Logo'

const Header = () => {
    return (
        <header className='shadow-md'>
            <div className='flex items-center justify-between px-5 md:px-7.5'>
                <Logo className='max-w-[14%] md:max-w-[12%] lg:max-w-[6%]' />
                <Link to='/login'>Login</Link>
            </div>
        </header>
    )
}

export default Header
