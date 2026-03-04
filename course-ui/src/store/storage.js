// const token = localStorage.getItem('accessToken')

// Save token in localStorage
const saveToken = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken)

    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
    }
}

// Remove token from localStorage
const removeToken = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    // console.log('Removed Token');
}

const getToken = () => {
    return localStorage.getItem('accessToken')
}


export {
    saveToken,
    removeToken,
    getToken
}