import { statuslogin } from "./auth.js";
const menu = document.getElementById('menu');
const menulist = document.getElementById('menu-list');
const accountname = document.getElementById('accountname');
confirmstatuslogin();
function confirmstatuslogin () {
    const userlogin = statuslogin();
    accountname.textContent = userlogin ? userlogin.username : "Guest";
    // if (loginstatus) {
    //     accountname.textContent = `${loginstatus.username}`;
    // }
    // else {
    //     accountname.textContent = `Guest`;
    // }
}
menu.addEventListener('click', () => {
    menulist.classList.toggle('showmenu');
    menu.classList.toggle('active');
})

