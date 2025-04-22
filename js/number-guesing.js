import { getUsers ,saveUsers,statuslogin, login } from "./auth.js";

class NumberGuessingGame {
    constructor() {
        this.btnstart = document.getElementById('btnstart');
        this.formguess = document.getElementById('formguess');
        this.btnguess = document.getElementById('btnguess');
        this.guesser = document.getElementById('guesser');
        this.inptguess = document.getElementById('inptguess');

        this.attempt = 5;
        this.statuswin = false;
        this.secretnumber;

        this.users = getUsers();
        this.userlogin = statuslogin();
    }   
    startgame () {
        this.formguess.style.display = 'block';
        this.btnstart.style.display = 'none';
        this.secretnumber = Math.floor(Math.random()*100) + 1;
        this.guesser.textContent = "Guess the number I'm thinking of!";
        console.log (this.secretnumber);
    }
    processguess (inptguess) {
        if (inptguess != "") {
            if (inptguess != this.secretnumber) {
                if (inptguess > this.secretnumber) {
                    if (Math.abs (inptguess - this.secretnumber) <= 5) {
                        this.guesser.textContent = "Lower it little more"
                    }
                    else {
                        this.guesser.textContent = "The guessed number is too big"
                    }
                }
                else {
                    if (Math.abs (inptguess - this.secretnumber) <= 5) {
                        this.guesser.textContent = "Raise it little more"
                    }
                    else {
                        this.guesser.textContent = "The guessed number is too low"
                    } 
                }
            }
            else {
                this.guesser.textContent = `YOU WIN, The correct number is ${this.secretnumber}`;
                this.statuswin = true;
                this.savedatagame(this.statuswin)
                this.reset ();
            }
            inptguess = "";
            this.chances();
        }
        else {
            this.guesser.textContent = "You didn't input the guessed number";
        }
        this. inptguess.focus();
    }
    chances () {
        if (this.attempt > 0) {
            this.attempt --;
        }
        else {
            this.guesser.textContent = `You Lose, the correct is ${this.secretnumber}`;
            this.statuswin = false;
            this.savedatagame(this.statuswin);
            this.reset();
        }
        console.log(this.attempt);
    }
    savedatagame (statuswin) {
        if (this.userlogin) {
            const user = this.users.find(user => user.username == this.userlogin.username && user.password == this.userlogin.password);
            const numberguessing = user.numberguessing;
            statuswin ? numberguessing.win += 1 : numberguessing.lose += 1;
            numberguessing.tg += 1;
            saveUsers(this.users);
            login(user);
        }
    }
    reset () {
        this.formguess.style.display = 'none';
        this.btnstart.style.display = 'block';
        this.btnstart.textContent = 'Play Again'
        this.attempt = 5;
    }
}
// new NumberGuessingGame();
const numberguessinggame = new NumberGuessingGame();
const btnstart = document.getElementById('btnstart');
const btnguess = document.getElementById('btnguess');
const inptguess = document.getElementById('inptguess');

btnstart.addEventListener ('click', () => {
    numberguessinggame.startgame();
});

btnguess?.addEventListener('click', () => {
    numberguessinggame.processguess(inptguess.value);
    inptguess.value = "";
});

inptguess?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        numberguessinggame.processguess(inptguess.value);
        inptguess.value = "";
    }
});
// export default NumberGuessingGame;


