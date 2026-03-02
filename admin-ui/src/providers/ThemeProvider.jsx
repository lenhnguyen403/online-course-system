import { useState, useEffect } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        () => {
            const savedTheme = localStorage.getItem('theme')
            return savedTheme || 'dark'
        }
    )

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }

    useEffect(() => {
        localStorage.setItem('theme', theme)
        document.documentElement.classList.toggle('light', theme === 'light')
    }, [theme])


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}