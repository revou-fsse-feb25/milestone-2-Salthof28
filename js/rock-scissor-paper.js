import { getUsers ,saveUsers,statuslogin, login } from "./auth.js";
// const choices = ['rock', 'paper', 'scissor'];
const choices = [{name: 'rock', src: 'assets/rock.png'}, {name: 'paper', src: 'assets/paper.png'}, {name: 'scissor', src: 'assets/scissor.png'}];
const players = document.querySelectorAll ('#player');
const btnstart = document.getElementById ('btnstart');
const result = document.getElementById ('result');
const playerscore = document.getElementById ('playerscore');
const computerscore = document.getElementById ('computerscore');
const handcontainer = document.getElementById ('handcontainer');
const handplayer = document.getElementById ('handplayer');
const handcomputer = document.getElementById ('handcomputer');
const btnchoices = document.getElementById ('btnchoices');
const inptmaxscore = document.getElementById ('maxscore');
const finalresult = document.getElementById ('finalresult');
const nicknameplayer = document.getElementById ('nicknameplayer');
let playerpoint = 0;
let computerpoint = 0;
let computer;
let computerchoices;
let angle = 0;
let direction = 1;
let interval;
let maxscore = 0;
let statuswin = false;
const users = getUsers();
const userlogin = statuslogin();
disablestart();
nickname();
function nickname () {
    const loginstatus = statuslogin();
    nicknameplayer.textContent = loginstatus ? loginstatus.username.toUpperCase() : 'PLAYER';
}
function disablestart () {
    if (maxscore == 0) {
        btnstart.setAttribute('disabled', 'disabled');
        handcontainer.style.display = 'none';
    }
    else {
        btnstart.removeAttribute('disabled', 'disabled');
    }
}
inptmaxscore.addEventListener('input', (x) => {
    maxscore = x.target.value
    disablestart();
})
btnstart.addEventListener ('click', () => {
    playerpoint = computerpoint = 0;
    playerscore.textContent = 0;
    computerscore.textContent = 0;
    result.textContent = "";
    console.log(maxscore.value);
    inptmaxscore.style.display = 'none';
    btnstart.style.display = 'none';
    finalresult.style.display = 'none';
    handcontainer.style.display = '';
    start();
})
function start () {
    computer = Math.floor(Math.random()*choices.length);
    computerchoices = choices[computer].name;
    btnchoices.style.display = '';
}
for (let player of players) {
    player.addEventListener ('click', () => {
        let playerchoices = choices[player.value].name;
        btnchoices.style.display = 'none';
        animationhand();
        console.log(playerchoices);
        console.log(computerchoices);
        setTimeout(() => {
            if (playerchoices == computerchoices){
                result.textContent = "DRAW";
            }
            else if ((playerchoices == 'rock' && computerchoices == 'scissor') || (playerchoices == 'paper' && computerchoices == 'rock') || (playerchoices == 'scissor' && computerchoices == 'paper')) {
                playerpoint ++;
                playerscore.textContent = playerpoint;
                computerscore.textContent = computerpoint;
                result.textContent = "WIN";
            }
            else {
                computerpoint ++;
                playerscore.textContent = playerpoint;
                computerscore.textContent = computerpoint;
                result.textContent = "LOSE";
            }
            handplayer.style.backgroundImage = `url(${choices[player.value].src})`;
            handcomputer.style.backgroundImage = `url(${choices[computer].src})`;
            endgame();
        },2000)
    })
}
function animationhand() {
    handplayer.style.backgroundImage = handcomputer.style.backgroundImage = `url('assets/rock.png')`;
    interval = setInterval(() => {
        angle -= 10 * direction;
        if (angle <= -60 || angle >= 0) {
            direction *= -1;
        }
        handplayer.style.transform = `rotate(${angle}deg)`;
        handcomputer.style.transform = `scaleX(-1) rotate(${angle}deg)`;
    }, 38);
    setTimeout(() => {
        clearInterval(interval);
        handcomputer.style.transform = `scaleX(-1) rotate(0deg)`;
        handplayer.style.transform = `rotate(0deg)`;
    },2000);
}

function endgame() {
    if (playerpoint == maxscore){
        resetgame();
        finalresult.textContent = `PLAYER WIN`;
        statuswin = true;
        savedatagame(statuswin);
    }
    else if (computerpoint == maxscore){
        resetgame();
        finalresult.textContent = `COMPUTER WIN`;
        statuswin = false;
        savedatagame(statuswin);
    }
    else {
        start ();
    }
}
function resetgame (){
    handplayer.style.backgroundImage = handcomputer.style.backgroundImage = `url('assets/rock.png')`;
    finalresult.style.display = '';
    handcontainer.style.display = 'none';
    inptmaxscore.style.display = '';
    btnstart.style.display = '';
    inptmaxscore.value = maxscore = 0;
    disablestart();
}
function savedatagame (statuswin) {
    if (userlogin) {
        const user = users.find(user => user.username == userlogin.username && user.password == userlogin.password);
        const rockpaperscissor = user.rockpaperscissor;
        statuswin ? rockpaperscissor.win += 1 : rockpaperscissor.lose += 1;
        rockpaperscissor.tg += 1;
        saveUsers(users);
        login(user);
    }
}