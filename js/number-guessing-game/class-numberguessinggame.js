import { getUsers ,saveUsers,statuslogin, login } from "../auth.js";

class NumberGuessingGame {
    constructor() {
        this.btnstart = document.getElementById('btnstart');
        this.formguess = document.getElementById('formguess');
        this.btnguess = document.getElementById('btnguess');
        this.guesser = document.getElementById('guesser');
        this.inptguess = document.getElementById('inptguess');
        this.rangeguess = document.getElementById('rangeguess');
        this.dataleaderboard = document.getElementById('dataleaderboard');
        this.attemptdisplay = document.getElementById('attemptdisplay');
        this.howplaycontainer = document.getElementById('howplay');
        this.leaderboardcontainer = document.getElementById('leaderboard');
        this.soundwin = new Audio ('assets/audio/win.mp3');
        this.soundlose = new Audio ('assets/audio/lose.mp3');
        this.attempt = 5;
        this.statuswin = false;
        this.secretnumber;
        this.users = getUsers();
        this.userlogin = statuslogin();
        this.disablestart(this.rangeguess.value);
        this.leaderboardcontainer.style.display = 'none';
        this.leaderboard();
    }
    disablestart (range) {
        console.log(range);
        if (range == 0) {
            this.btnstart.setAttribute('disabled', 'disabled');
        }
        else {
            this.btnstart.removeAttribute('disabled')
        }
    }   
    startgame () {
        this.leaderboardcontainer.style.display = 'flex';
        this.howplaycontainer.style.display = 'none';
        this.rangeguess.style.display = 'none';
        this.formguess.style.display = 'block';
        this.btnstart.style.display = 'none';
        this.secretnumber = Math.floor(Math.random()*this.rangeguess.value) + 1;
        this.guesser.textContent = `Guess the number I'm thinking of!`;
        this.attemptdisplay.textContent = `Attempt: ${this.attempt}`;
        console.log (this.secretnumber);
    }
    processguess (inptguess) {
        if (inptguess != "") {
            const convertrangeguess = Number(this.rangeguess.value);
            inptguess > convertrangeguess ? this.guesser.textContent = `Your guessed number is out of range. The range 1 - ${this.rangeguess.value}` : this.isCorrectGuest(inptguess);;
        }
        else {
            this.guesser.textContent = "You didn't input the guessed number";
        }
        this. inptguess.focus();
    }
    isCorrectGuest (inptguess) {
            if (inptguess != this.secretnumber) {
                this.evaluateguess(inptguess);
                this.chances();
            }
            else {
                this.guesser.textContent = `YOU WIN, The correct number is ${this.secretnumber}`;
                this.statuswin = true;
                this.savedatagame(this.statuswin);
                this.soundwin.play();
                this.reset ();
            }
            inptguess = "";
    }
    evaluateguess (inptguess) {
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
    chances () {
        if (this.attempt > 1) {
            this.attempt --;
            this.attemptdisplay.textContent = `Attempt: ${this.attempt}`;
        }
        else {
            this.guesser.textContent = `You Lose, the correct is ${this.secretnumber}`;
            this.statuswin = false;
            this.savedatagame(this.statuswin);
            this.reset();
            this.soundlose.play();
        }
    }
    savedatagame (statuswin) {
        if (this.userlogin) {
            const user = this.users.find(user => user.username === this.userlogin.username && user.password === this.userlogin.password);
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
        this.btnstart.textContent = 'Play Again';
        this.rangeguess.style.display = '';
        this.attempt = 5;
        this.dataleaderboard.innerHTML = ''; // remove tr from tbody
        this.attemptdisplay.textContent = ``;
        this.leaderboard();
    }
    leaderboard () {
        if (this.users) {
            const userssort = this.users.sort ((a, b) => b.numberguessing.win - a.numberguessing.win);
            userssort.forEach((databaseusers, index) => {
                const username = databaseusers.username;
                const numberguessing = databaseusers.numberguessing;
                const trElement = document.createElement('tr');
                const tdIndex = document.createElement('td');
                tdIndex.textContent = index + 1;
                const tdUsername = document.createElement('td');
                tdUsername.textContent = username;
                const tdLose = document.createElement('td');
                tdLose.textContent = numberguessing.lose;
                const tdWin = document.createElement('td');
                tdWin.textContent = numberguessing.win; 
                trElement.append(tdIndex, tdUsername, tdLose, tdWin);
                this.dataleaderboard.appendChild(trElement);
            });
        }
    }
}
export default NumberGuessingGame;