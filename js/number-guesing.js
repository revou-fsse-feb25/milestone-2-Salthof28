import { getUsers ,saveUsers,statuslogin, login } from "./auth.js";
const btnstart = document.getElementById('btnstart');
const formguess = document.getElementById('formguess');
const btnguess = document.getElementById('btnguess');
let guesser = document.getElementById('guesser');
let inptguess = document.getElementById('inptguess');
let attempt = 5;
let statuswin = false;
let secretnumber;
const users = getUsers();
const userlogin = statuslogin();

btnstart.addEventListener('click', function () {
    formguess.style.display = 'block';
    btnstart.style.display = 'none';
    secretnumber = Math.floor(Math.random()*100) + 1;
    guesser.textContent = "Guess the number I'm thinking of!";
    console.log (secretnumber);
})
btnguess.addEventListener('click', processguess)
inptguess.addEventListener('keydown', function (event) {
    if(event.key === 'Enter'){
        event.preventDefault(); // made click enter not refresh website
        processguess();
    }
})
function processguess () {
    if (inptguess.value != "") {
        if (inptguess.value != secretnumber) {
            if (inptguess.value > secretnumber) {
                if (Math.abs (inptguess.value - secretnumber) <= 5) {
                    guesser.textContent = "Lower it little more"
                }
                else {
                    guesser.textContent = "The guessed number is too big"
                }
            }
            else {
                if (Math.abs (inptguess.value - secretnumber) <= 5) {
                    guesser.textContent = "Raise it little more"
                }
                else {
                    guesser.textContent = "The guessed number is too low"
                } 
            }
        }
        else {
            guesser.textContent = `YOU WIN, The correct number is ${secretnumber}`;
            statuswin = true;
            savedatagame(statuswin)
            reset ();
        }
        inptguess.value = "";
        chances();
    }
    else {
        guesser.textContent = "You didn't input the guessed number";
    }
    inptguess.focus();
}
function reset () {
    formguess.style.display = 'none';
    btnstart.style.display = 'block';
    btnstart.textContent = 'Play Again'
    attempt = 5;
}
function chances () {
    if (attempt > 0) {
        attempt --;
    }
    else {
        guesser.textContent = `You Lose, the correct is ${secretnumber}`;
        statuswin = false;
        savedatagame(statuswin);
        reset();
    }
    console.log(attempt);
}
// savedatagame(statuswin);
function savedatagame (statuswin) {
    if (userlogin) {
        const user = users.find(user => user.username == userlogin.username && user.password == userlogin.password);
        const numberguessing = user.numberguessing;
        statuswin ? numberguessing.win += 1 : numberguessing.lose += 1;
        numberguessing.tg += 1;
        saveUsers(users);
        login(user);
    }
}
