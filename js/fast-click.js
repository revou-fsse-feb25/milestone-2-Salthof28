import { getUsers ,saveUsers,statuslogin, login } from "./auth.js";
const start = document.getElementById ('start');
const plus = document.getElementById ('plus');
let scoretext = document.getElementById ('scoretext');
let timetext = document.getElementById ('time');
let score = 0;
let time = 6;
const users = getUsers();
const userlogin = statuslogin();

start.addEventListener ('click', function () {
    score = 0;
    timer ();
    scoretext.textContent = "SCORE";
    start.style.display = "none";
    plus.style.display = "block";
})

plus.addEventListener ('click', function () {
    score ++;
    scoretext.textContent = score;
})

function timer () {
    if (time > 0) {
        time --;
        timetext.textContent = time;
        setTimeout(timer, 1000); 
    }
    else {
        time = 10;
        scoretext.textContent = `Your score is ${score}`;
        timetext.textContent = "TIMEOUT";
        start.style.display = "block";
        plus.style.display = "none";
        savedatagame(score);
    }
}

function savedatagame (score) {
    if (userlogin) {
        const user = users.find(user => user.username == userlogin.username && user.password == userlogin.password);
        const fastclicker = user.fastclicker;
        fastclicker.hs = Math.max(score, fastclicker.hs); // comparison score, if "score" is higher then "fastclicker.hg". Value "score" store to "fastclicker.hg".
        fastclicker.tg += 1;
        saveUsers(users);
        login(user);
    }
}