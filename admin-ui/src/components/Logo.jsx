import React from 'react'
import logo from '/logo.png'

const Logo = ({ className }) => {
    return (
        <>
            <img src={logo}
                alt="logo"
                className={className}
            />
        </>
    )
}

export default Logo
