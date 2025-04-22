import { getUsers ,saveUsers,statuslogin, login } from "./auth.js";

class RockScissorPaper {
    constructor () {
        this.choices = [{name: 'rock', src: 'assets/rock.png'}, {name: 'paper', src: 'assets/paper.png'}, {name: 'scissor', src: 'assets/scissor.png'}];
        this.players = document.querySelectorAll ('#player');
        this.btnstart = document.getElementById ('btnstart');
        this.result = document.getElementById ('result');
        this.playerscore = document.getElementById ('playerscore');
        this.computerscore = document.getElementById ('computerscore');
        this.handcontainer = document.getElementById ('handcontainer');
        this.handplayer = document.getElementById ('handplayer');
        this.handcomputer = document.getElementById ('handcomputer');
        this.btnchoices = document.getElementById ('btnchoices');
        this.inptmaxscore = document.getElementById ('maxscore');
        this.finalresult = document.getElementById ('finalresult');
        this.nicknameplayer = document.getElementById ('nicknameplayer');
        this.maxscoredisplay = document.getElementById('maxscoredisplay');
        this.dataleaderboard = document.getElementById('dataleaderboard');

        this.playerpoint = 0;
        this.computerpoint = 0;
        this.computer;
        this.computerchoices;
        this.angle = 0;
        this.direction = 1;
        this.interval;
        this.maxscore = 0;
        this.statuswin = false;

        this.users = getUsers();
        this.userlogin = statuslogin();

        this.disablestart(this.maxscore);
        this.nickname();
        this.leaderboard();
    }
    nickname () {
        const loginstatus = this.userlogin;
        this.nicknameplayer.textContent = loginstatus ? loginstatus.username.toUpperCase() : 'PLAYER';
    }
    disablestart (maxscore) {
        if (maxscore == 0) {
            this.btnstart.setAttribute('disabled', 'disabled');
            this.handcontainer.style.display = 'none';
        }
        else {
            this.btnstart.removeAttribute('disabled');
            this.maxscore = maxscore;
        }
    }
    setup () {
        this.playerpoint = this.computerpoint = 0;
        this.playerscore.textContent = 0;
        this.computerscore.textContent = 0;
        this.result.textContent = "";
        console.log(this.maxscore);
        this.inptmaxscore.style.display = 'none';
        this.btnstart.style.display = 'none';
        this.finalresult.style.display = 'none';
        this.handcontainer.style.display = '';
        this.maxscoredisplay.textContent = `Max Score Win: ${this.maxscore}`
    }
    start () {
        this.computer = Math.floor(Math.random()*this.choices.length);
        this.computerchoices = this.choices[this.computer].name;
        this.btnchoices.style.display = '';
        console.log(this.computerchoices);
    }
    processguess (value) {
        let playerchoices = this.choices[value].name;
        this.btnchoices.style.display = 'none';
        this.animationhand();
        console.log(playerchoices);
        setTimeout(() => {
            switch (true) {
                case (playerchoices === this.computerchoices):
                    this.result.textContent = "DRAW";
                    break;
                case (playerchoices === 'rock' && this.computerchoices === 'scissor'):
                case (playerchoices === 'paper' && this.computerchoices === 'rock'):
                case (playerchoices === 'scissor' && this.computerchoices === 'paper'):
                    this.playerpoint ++;
                    this.playerscore.textContent = this.playerpoint;
                    this.computerscore.textContent = this.computerpoint;
                    this.result.textContent = "WIN";
                    break
                default:
                    this.computerpoint++;
                    this.playerscore.textContent = this.playerpoint;
                    this.computerscore.textContent = this.computerpoint;
                    this.result.textContent = "LOSE";
                    break;
            }
            this.handplayer.style.backgroundImage = `url(${this.choices[value].src})`;
            this.handcomputer.style.backgroundImage = `url(${this.choices[this.computer].src})`;
            this.endgame();
        },2000)
    }
    animationhand () {
        this.handplayer.style.backgroundImage = this.handcomputer.style.backgroundImage = `url('assets/rock.png')`;
        this.interval = setInterval(() => {
            this.angle -= 10 * this.direction;
            if (this.angle <= -60 || this.angle >= 0) {
                this.direction *= -1;
            }
            this.handplayer.style.transform = `rotate(${this.angle}deg)`;
            this.handcomputer.style.transform = `scaleX(-1) rotate(${this.angle}deg)`;
        }, 38);
        setTimeout(() => {
            clearInterval(this.interval);
            this.handcomputer.style.transform = `scaleX(-1) rotate(0deg)`;
            this.handplayer.style.transform = `rotate(0deg)`;
        },2000);
    }
    endgame () {
        if (this.playerpoint == this.maxscore){
            this.finalresult.textContent = `PLAYER WIN`;
            this.statuswin = true;
            this.savedatagame(this.statuswin);
            this.resetgame();
        }
        else if (this.computerpoint == this.maxscore){
            this.finalresult.textContent = `COMPUTER WIN`;
            this.statuswin = false;
            this.savedatagame(this.statuswin);
            this.resetgame();
        }
        else {
            this.start ();
        }
    }
    savedatagame(statuswin) {
        if (this.userlogin) {
            const user = this.users.find(user => user.username === this.userlogin.username && user.password === this.userlogin.password);
            const rockpaperscissor = user.rockpaperscissor;
            statuswin ? rockpaperscissor.win += 1 : rockpaperscissor.lose += 1;
            rockpaperscissor.tg += 1;
            saveUsers(this.users);
            login(user);
        }
    }
    resetgame () {
        this.handplayer.style.backgroundImage = this.handcomputer.style.backgroundImage = `url('assets/rock.png')`;
        this.finalresult.style.display = '';
        this.handcontainer.style.display = 'none';
        this.inptmaxscore.style.display = '';
        this.btnstart.style.display = '';
        this.inptmaxscore.value = this.maxscore = 0;
        this.maxscoredisplay.textContent = ``
        this.dataleaderboard.innerHTML = '';
        this.disablestart();
        this.leaderboard();
    }
    leaderboard () {
        if (this.users) {
            const userssort = this.users.sort ((a, b) => b.rockpaperscissor.win - a.rockpaperscissor.win);
            userssort.forEach((databaseusers, index) => {
                const username = databaseusers.username;
                const numberguessing = databaseusers.rockpaperscissor;
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

const rockscissorpaper = new RockScissorPaper();
const inptmaxscore = rockscissorpaper.inptmaxscore;
const btnstart = rockscissorpaper.btnstart;
const players = rockscissorpaper.players;

inptmaxscore.addEventListener('input', (x) => {
    let maxscore = x.target.value
    rockscissorpaper.disablestart(maxscore);
})

btnstart.addEventListener('click', () => {
    rockscissorpaper.start();
    rockscissorpaper.setup();
})

for (let player of players) {
    player.addEventListener('click', () => {
        rockscissorpaper.processguess(player.value);
    })
}