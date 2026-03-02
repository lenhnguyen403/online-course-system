import React from 'react'
import Logo from '../../components/Logo'
import { Link } from 'react-router-dom'
import { footerData } from '../../data/footerData'
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";

const Footer = () => {
    return (
        <footer className='py-6 md:py-10 bg-gray-300'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-5 px-6 md:px-7.5 mb-6 md:mb-8'>
                <div>
                    <Link to='/'>
                        <Logo className='max-w-25 ' />
                    </Link>
                    <ul className='flex flex-col'>
                        <li className='hover:text-orange-500 transition-colors inline-flex items-center gap-2 leading-7'>
                            <FaPhone />
                            <Link to='tel:+84368248952'>+84 368248952</Link>
                        </li>
                        <li className='hover:text-orange-500 transition-colors inline-flex items-center gap-2 leading-7'>
                            <IoIosMail />
                            <Link to='mailto:admin@5tech.edu'>admin@5tech.edu</Link>
                        </li>
                        <li className='inline-flex items-center gap-2 leading-7'>
                            <FaLocationDot />
                            <span>Ha Noi, Viet Nam</span>
                        </li>
                    </ul>
                </div>
                {
                    footerData.map((category, id) => {
                        return (
                            <div key={id} className=''>
                                <h2 className='font-bold mb-2 uppercase'>{category.heading}</h2>
                                <ul>
                                    {category.links.map((link, index) => {
                                        return (
                                            <li key={index} className='leading-7'>
                                                <Link to={link.url}
                                                    className='hover:ml-2 hover:text-orange-500 transition-all'
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
            <hr className='border-gray-400 max-w-[90%] mx-auto my-2.5' />
            <div className='text-center text-sm mt-5 md:mt-7.5'>
                &copy; 2026 Course UI. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
