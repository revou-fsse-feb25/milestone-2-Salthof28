import { getUsers ,saveUsers,statuslogin, login } from "../auth.js";

class FastClick {
    constructor () {
        this.btnstart = document.getElementById ('start');
        this.btnclickme = document.getElementById ('plus');
        this.scoretext = document.getElementById ('scoretext');
        this.timetext = document.getElementById ('time');
        this.dataleaderboard = document.getElementById ('dataleaderboard');
        this.howplaycontainer = document.getElementById('howplay');
        this.leaderboardcontainer = document.getElementById('leaderboard');
        this.initialTimer = 10;
        this.score = 0;
        this.timer = this.initialTimer;
        this.users = getUsers();
        this.userlogin = statuslogin();
        this.interval = null;
        this.leaderboardcontainer.style.display = 'none';
        this.leaderboard();
    }

    startgame () {
        this.score = 0;
        this.scoretext.textContent = "SCORE";
        this.btnstart.style.display = "none";
        this.btnclickme.style.display = "block";
        this.leaderboardcontainer.style.display = 'flex';
        this.howplaycontainer.style.display = 'none';
        this.timetext.textContent = `Timer: ${this.timer}`;
        this.timergame ();
    }

    timergame () {
        this.interval = setInterval (() => {
            if (this.timer > 1) {
                this.timer --;
                this.timetext.textContent = `Timer: ${this.timer}`;
            }
            else {
                this.scoretext.textContent = `Your score is ${this.score}`;
                this.savedatagame(this.score);
                this.reset();
            }
        }, 1000)
    }
    countingscore () {
        this.score ++;
        this.scoretext.textContent = this.score;
    }

    savedatagame () {
        if (this.userlogin) {
            const user = this.users.find(user => user.username === this.userlogin.username && user.password === this.userlogin.password);
            const fastclicker = user.fastclicker;
            fastclicker.hs = Math.max(this.score, fastclicker.hs);
            fastclicker.tg += 1;
            saveUsers(this.users);
            login(user);
        }
        this.reset();
    }
    reset () {
        clearInterval(this.interval);
        this.timer = this.initialTimer;
        this.timetext.textContent = "TIMEOUT";
        this.btnstart.style.display = "block";
        this.btnclickme.style.display = "none";
        this.dataleaderboard.textContent = "";
        this.leaderboard();
    }
    leaderboard () {
        if (this.users) {
            const userssort = this.users.sort ((a, b) => b.fastclicker.hs - a.fastclicker.hs);
            userssort.forEach((databaseusers, index) => {
                const username = databaseusers.username;
                const fastclicker = databaseusers.fastclicker;
                const trElement = document.createElement('tr');
                const tdIndex = document.createElement('td');
                tdIndex.textContent = index + 1;
                const tdUsername = document.createElement('td');
                tdUsername.textContent = username;
                const tdHighScore = document.createElement('td');
                tdHighScore.textContent = fastclicker.hs;
                trElement.append(tdIndex, tdUsername, tdHighScore);
                this.dataleaderboard.appendChild(trElement);
            });
        }
    }

}

export default FastClick;