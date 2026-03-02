// const token = localStorage.getItem('accessToken')

// Save token in localStorage
const saveToken = () => {

}

// Remove token from localStorage
const removeToken = () => {
    localStorage.removeItem('accessToken')
    // console.log('Removed Token');
}


export {
    saveToken,
    removeToken
}