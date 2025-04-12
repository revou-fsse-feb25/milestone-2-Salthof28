function getUsers() {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : []; // if data users null, then it's returned empty array
    // if (usersData) {
    //     return JSON.parse(usersData);
    // } 
    // else {
    //     return [];
    // }
}
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users)); // convert array object to string for save to file .json localstorage
}

function login (users) {
    localStorage.setItem('userlogin', JSON.stringify(users))
}
function statuslogin() {
    return JSON.parse(localStorage.getItem('userlogin'));
}
function logout() { 
    localStorage.removeItem('userlogin')
}
export { getUsers, saveUsers, login, statuslogin, logout }