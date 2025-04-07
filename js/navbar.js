const menu = document.getElementById('menu');
const menulist = document.getElementById('menu-list');

menu.addEventListener('click', () => {
    menulist.classList.toggle('showmenu');
    menu.classList.toggle('active');
})

