import React from 'react'
import Logo from '../../components/Logo'

const Footer = () => {
    return (
        <footer className='py-6 md:py-10 bg-gray-300'>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-7.5 px-6 md:px-7.5 mb-6 md:mb-0'>
                <div className='col-span-2 md:col-span-1 '>
                    <Logo className='' />
                </div>
                <div className=''>
                    <h2 className='font-bold mb-2'>Heading</h2>
                    <ul>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                    </ul>
                </div>
                <div className=''>
                    <h2 className='font-bold mb-2'>Heading</h2>
                    <ul>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                    </ul>
                </div>
                <div className=''>
                    <h2 className='font-bold mb-2'>Heading</h2>
                    <ul>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                    </ul>
                </div>
                <div className=''>
                    <h2 className='font-bold mb-2'>Heading</h2>
                    <ul>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                        <li><a className='' href="#">Link abcxyzt</a></li>
                    </ul>
                </div>
            </div>
            <hr className='border-gray-400 max-w-[90%] mx-auto my-2.5' />
            <div className='text-center text-sm mt-5 md:mt-0'>
                &copy; 2026 Course UI. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
