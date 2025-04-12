import { getUsers, saveUsers } from "./auth.js";
const createAccount = document.getElementById ('create-account');
const createAccountForm = document.getElementById ('create-account-form');
const successcreate = document.getElementById ('successcreate');

createAccount.addEventListener('click', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const users = getUsers();
    if ((!username.trim() || !password.trim()) || (username.length > 8)) {
        alert("Fill out all fields and Maximal Username only 8 character");
    }
    else {
        const exists = users.find(user => user.username === username);
        if (exists) {
            alert("Username already exists");
        }
        else {
            users.push({ username: `${username.trim()}`, password: `${password.trim()}`, numberguessing: {win: 0, lose: 0, tg: 0}, rockpaperscissor: {win: 0, lose: 0, tg: 0}, fastclicker: {hs: 0, tg: 0} });
            saveUsers(users);
            createAccountForm.style.display = 'none';
            successcreate.style.display = 'flex';
            setTimeout (() => {
                window.location.href = "login.html";
            }, 1000)
        } 
    }  
})

