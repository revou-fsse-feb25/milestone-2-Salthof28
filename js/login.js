import { getUsers, login, statuslogin, logout } from "./auth.js";
const loginbtn = document.getElementById ('login');
const logoutbtn = document.getElementById ('logout');
const loginform = document.getElementById ('loginform');
const profileuser = document.getElementById ('profileuser');
const profilename = document.getElementById ('profilename');
const WNumberGuessing = document.getElementById ('WNumberGuessing');
const LNumberGuessing = document.getElementById ('LNumberGuessing');
const TGNumberGuessing = document.getElementById ('TGNumberGuessing');
const WRockPaperScissor = document.getElementById ('WRockPaperScissor');
const LRockPaperScissor = document.getElementById ('LRockPaperScissor');
const TGRockPaperScissor = document.getElementById ('TGRockPaperScissor');
const WPokemonMemoryGame = document.getElementById ('WPokemonMemoryGame');
const LPokemonMemoryGame = document.getElementById ('LPokemonMemoryGame');
const TGPokemonMemoryGame = document.getElementById ('TGPokemonMemoryGame');
const HGFastClicker = document.getElementById ('HGFastClicker');
const TGFastClicker = document.getElementById ('TGFastClicker');
const users = getUsers();

confirmstatuslogin();
function confirmstatuslogin () {
    const userlogin = statuslogin();
    if (userlogin) {
        loginform.style.display = 'none';
        profileuser.style.display = 'flex';
        profilename.textContent = `${userlogin.username}`;
        updateprofile(userlogin);
    } 
    else {
        loginform.style.display = 'flex';
        profileuser.style.display = 'none';
        accountname.textContent = `Guest`;
    }
}

loginbtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const match = users.find(user => user.username == username && user.password == password);
    if (match) {
        login (match);
        confirmstatuslogin();
    }
    else {
        alert('username atau password salah!');
        username = '';
        password = '';
    }
})

logoutbtn.addEventListener('click', () => {
    logout();
    // statuslog && logout();
    // if (statuslog) {
    //     logout();
    // }
    confirmstatuslogin();
})

function updateprofile (user) {
    // console.log(user.RockPaperScissor.);
    const numberguessing = user.numberguessing;
    const rockpaperscissor = user.rockpaperscissor;
    const fastclicker = user.fastclicker;
    const pokemonmemorygame = user.pokemonmemorygame;
    WNumberGuessing.textContent = `Win: ${numberguessing.win}`;
    LNumberGuessing.textContent = `Lose: ${numberguessing.lose}`;
    TGNumberGuessing.textContent = `Total Game: ${numberguessing.tg}`;

    WRockPaperScissor.textContent = `Win: ${rockpaperscissor.win}`;
    LRockPaperScissor.textContent = `Lose: ${rockpaperscissor.lose}`;
    TGRockPaperScissor.textContent = `Total Game: ${rockpaperscissor.tg}`;

    HGFastClicker.textContent = `High Score: ${fastclicker.hs}`;
    TGFastClicker.textContent = `Total Game: ${fastclicker.tg}`;

    WPokemonMemoryGame.textContent = `Win: ${pokemonmemorygame.win}`;
    LPokemonMemoryGame.textContent = `Lose: ${pokemonmemorygame.lose}`;
    TGPokemonMemoryGame.textContent = `Total Game: ${pokemonmemorygame.tg}`;
}