import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

const MainLayout = () => {
    return (
        <>
            <Header>
                <Link to='/login'>Login</Link>
            </Header>
            <Footer />
        </>
    )
}

export default MainLayout
