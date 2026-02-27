import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className=''>
            <Link to='/login'>Login</Link>
        </header>
    )
}

export default Header
