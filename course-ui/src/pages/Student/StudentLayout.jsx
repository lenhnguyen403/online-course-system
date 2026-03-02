import React from 'react'
import { Link } from 'react-router-dom'
import { removeToken } from '../../store/storage'

const StudentLayout = () => {

    // const token = localStorage.getItem('accessToken')
    // console.log('Token info: ', token);

    const logout = () => {
        removeToken()
    }

    return (
        <div>
            <Link to='/'
                onClick={logout}>
                Logout
            </Link>
        </div>
    )
}

export default StudentLayout
