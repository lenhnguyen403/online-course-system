import { adminMenu } from '../../data/adminMenu'
import Header from '../../layouts/Header/Header'
import Logo from '../../components/Logo'
import { Link, NavLink } from 'react-router-dom'

const AdminDashboard = () => {
    return (
        <>
            <nav className='max-w-62.5 lg:max-w-70 shadow-md fixed h-full'>
                <div className='p-4 pb-0 inline-flex items-center gap-2 font-bold text-orange-400'>
                    <Logo className='max-w-[20%]' />
                    F5 Administrator
                </div>
                <div className='p-5'>
                    <ul>
                        {
                            adminMenu.map((menuItem) => {
                                return (
                                    <li key={menuItem.id}
                                        className='lg:cursor-pointer hover:bg-orange-300 hover:rounded px-3 py-2 '
                                    >
                                        {menuItem.name}
                                        {/* <div className='p-3'>
                                            <ul>
                                                {
                                                    menuItem.subMenu.map((subItem) => {
                                                        return (
                                                            <li key={subItem.id}>
                                                                <NavLink to={subItem.link}>{subItem.subName}</NavLink>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div> */}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>


            </nav>
            <div className='lg:pl-70 relative'>
                <Header />
                <main className='p-5 bg-gray-200 lg:pt-25'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quis voluptatibus,
                    voluptatum dolores ullam at molestiae adipisci fugit saepe et dolorem veniam
                    tenetur cumque! Asperiores quibusdam fugit necessitatibus sit aut.
                </main>
            </div>
        </>
    )
}

export default AdminDashboard
