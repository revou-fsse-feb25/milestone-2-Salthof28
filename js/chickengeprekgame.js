import { getUsers ,saveUsers,statuslogin, login } from "./auth.js";

class ChickenGeprekGame {
    constructor () {
        this.object = [{name: 'knife', src: 'assets/chicken-geprek-game/knife.png'}, {name: 'dedak', src: 'assets/chicken-geprek-game/dedak.png'}, {name: 'cobek', src: 'assets/chicken-geprek-game/cobek.png'}];
        this.startposition = 50
        this.movestep = 2.5;
        this.initialFallspeed = 2;
        this.initiallife = 3;
        this.initialspawninterval = 1000
        this.clearobject = 500;
        this.playerPosition = this.startposition;

        this.settingspawninterval = this.initialspawninterval;
        this.gamestarted = false;
        this.spawninterval = null;
        this.pointinterval = null;
        this.survivepointinterval = null;
        this.dedakscore = false;
        this.fallspeed = this.initialFallspeed;
        this.score = 0;
        this.life = this.initiallife;

        this.dataleaderboard = document.getElementById ('dataleaderboard');
        this.howplaycontainer = document.getElementById('howplay');
        this.leaderboardcontainer = document.getElementById('leaderboard');
        this.player = document.getElementById('player');
        this.gameBox = document.getElementById('gameBox');
        this.containerWidth = this.gameBox.offsetWidth; // take width gameBox container
        this.btnstart = document.getElementById('btnstart');
        this.lifechickendisplay = document.getElementById('lifechickendisplay');
        this.scoredisplay = document.getElementById('scoredisplay');
        this.finalscoredisplay = document.getElementById('finalscoredisplay');
        this.gameoverdisplay = document.getElementById('gameover');
        this.finalscoredisplay = document.getElementById('finalscoredisplay');
        this.statusplayer = document.getElementById('statusplayer');
        this.handlekeydown = (event) => {
            this.movechicken(event.key);
        }; // can remove event
        this.users = getUsers();
        this.userlogin = statuslogin();

        this.player.style.display = 'none';
        this.leaderboard();
        this.disableenablekeydown();
    }
    disableenablekeydown () {
        console.log(this.gamestarted);
        if(this.gamestarted) {
            document.addEventListener('keydown', this.handlekeydown);
        }
        else {
            document.removeEventListener('keydown', this.handlekeydown);
        }
    }
    start () {
        this.player.style.left = `${this.playerPosition}%`;
        this.howplaycontainer.style.display = 'none'; 
        this.scoredisplay.textContent = `Score: ${this.score}`;
        this.lifechickendisplay.textContent = `Chicken Life: ${this.life}`;
        this.gamestarted = true;
        this.gameoverdisplay.style.display = 'none';
        this.statusplayer.style.display = 'block';
        this.disableenablekeydown();
        this.player.style.display = '';
        this.btnstart.style.display = 'none';
        this.spawnfallingobject();
        this.pointsurvive();
    }
    movechicken (key) {
        // offsetWidth returns the width of an element in pixels including padding and borders, but excluding margins.
        // const containerWidth = this.gameBox.offsetWidth; // take width gameBox container
        const playerWidth = this.player.offsetWidth; // take width player
        const maxLeftPercent = 100 - ((playerWidth / this.containerWidth) * 100); // this for calculate maximum position player
        switch (true) {
            case (key === "ArrowLeft" || key === "a"):
                this.player.style.transform = `scaleX(-1)`;
                this.playerPosition -= this.movestep;
                break;
            case (key === "ArrowRight" || key === "d"):
                this.player.style.transform = `scaleX(1)`;    
                this.playerPosition += this.movestep;
                break;
            default:
                break;
        }
        this.playerPosition = Math.max(0, Math.min(maxLeftPercent, this.playerPosition)); // use max and min for limitation player move
        this.player.style.left = `${this.playerPosition}%`;
    }

    spawnfallingobject (){
        this.spawninterval = setInterval (() => {
            const randomObj = this.object[Math.floor(Math.random() * this.object.length)];
            const fallingobj = document.createElement('div');
            fallingobj.id = `fallingobject`;
            fallingobj.style.backgroundImage = `url(${randomObj.src})`;
            fallingobj.setAttribute('data-value', `${randomObj.name}`);
            this.gameBox.appendChild(fallingobj);

            const objectwidth = fallingobj.offsetWidth;
            const maxleft = this.containerWidth - objectwidth;
            const leftspawn = Math.random() * maxleft;

            fallingobj.style.left = `${leftspawn}px`;
            fallingobj.style.top = `0px`;

            // let fallspeed = 2; // speed falling object
            let fromtop = 0;

            // set falling each object
            const fallInterval = setInterval(() => {
                fromtop += this.fallspeed;
                fallingobj.style.top = `${fromtop}px`;
                // chicken crash check
                this.collison(fallInterval, fallingobj);
                // if object has gone off container, delete the object.
                if (fromtop > this.gameBox.offsetHeight) {
                    clearInterval(fallInterval);
                    fallingobj.remove(); // delete objek after gone off container
                }
            }, 16) // for smooth falling 60fps => 1000ms/60fps = 16.67ms
            this.DifficultIncrease(this.fallspeed);
        }, this.settingspawninterval)
    }

    collison (fallInterval, fallingobj) {
        const playerRect = this.player.getBoundingClientRect();
        const objRect = fallingobj.getBoundingClientRect();
        const isCollison = !(playerRect.bottom < objRect.top || playerRect.top > objRect.bottom ||playerRect.right < objRect.left || playerRect.left > objRect.right);
        if(isCollison) {
            if (fallingobj.dataset.value === 'dedak'){
                fallingobj.remove();
                this.dedakscore = true;
                this.countpoint();
            }
            else {
                this.chickenlifecheck(fallInterval, fallingobj);
            }
        }
    }
    pointsurvive () {
        this.survivepointinterval = setInterval (() => {
            this.dedakscore = false;
            this.countpoint();
        }, 5000);
    }
    countpoint () {
        if(this.gamestarted){
            this.dedakscore ? this.scoredisplay.textContent = this.score += 20 : this.scoredisplay.textContent = this.score +=5;
        }
    }
    chickenlifecheck (fallInterval, fallingobj) {
        if(this.life > 1) {
            fallingobj.remove();
            this.life --;
            this.lifechickendisplay.textContent = `Chicken Life: ${this.life}`;
        }
        else {
            fallingobj.remove();
            clearInterval(fallInterval);
            clearInterval(this.spawninterval);
            this.endGame(); // call game over function
        }
    }
    DifficultIncrease (fallspeed) {
        switch(true) {
            case (this.score >= 250 && fallspeed < 4):
                fallspeed = 4;
                this.settingspawninterval = 200;
                clearInterval(this.spawninterval);
                this.spawnfallingobject();
                break;
            case (this.score >= 150 && this.settingspawninterval > 300):
                this.settingspawninterval = 300;
                clearInterval(this.spawninterval);
                this.spawnfallingobject();
                break;
            case (this.score >= 60 && this.settingspawninterval > 500):
                this.settingspawninterval = 500;
                clearInterval(this.spawninterval);
                this.spawnfallingobject();
                break;
            default:
                break;
        }
    }
    endGame () {
        console.log("Game Over: Ayam kena benda jatuh!");
        clearInterval(this.survivepointinterval);
        this.gamestarted = false;
        this.fallspeed = this.clearobject;
        this.disableenablekeydown();
        // this.btnstart.style.display = '';
        this.gameoverdisplay.style.display = 'flex';
        this.finalscoredisplay.textContent = `Score: ${this.score}`;
        this.savedatagame();
    }

    savedatagame () {
        if (this.userlogin) {
            const user = this.users.find(user => user.username === this.userlogin.username && user.password === this.userlogin.password);
            const chickengeprekgame = user.chickengeprekgame;
            chickengeprekgame.hs = Math.max(this.score, chickengeprekgame.hs);
            chickengeprekgame.tg += 1;
            saveUsers(this.users);
            login(user);
        }
        this.reset();
    }

    leaderboard () {
        if (this.users) {
            const userssort = this.users.sort ((a, b) => b.chickengeprekgame.hs - a.chickengeprekgame.hs);
            userssort.forEach((databaseusers, index) => {
                const username = databaseusers.username;
                const chickengeprekgame = databaseusers.chickengeprekgame;
                const trElement = document.createElement('tr');
                const tdIndex = document.createElement('td');
                tdIndex.textContent = index + 1;
                const tdUsername = document.createElement('td');
                tdUsername.textContent = username;
                const tdHighScore = document.createElement('td');
                tdHighScore.textContent = chickengeprekgame.hs;
                trElement.append(tdIndex, tdUsername, tdHighScore);
                this.dataleaderboard.appendChild(trElement);
            });
        }
    }
    reset () {
        this.score = 0;
        this.life = this.initiallife;
        this.playerPosition = this.startposition;
        this.fallspeed = this.initialFallspeed;
        this.player.style.display = 'none';
        this.settingspawninterval = this.initialspawninterval;
        this.dataleaderboard.textContent = "";
        this.leaderboardcontainer.style.display = 'flex';
        this.leaderboard();
    }
}

const chickengeprekgame = new ChickenGeprekGame();
const btnstart = chickengeprekgame.btnstart;
const btnplayagain = document.getElementById('btnplayagain');

btnstart.addEventListener('click', () => {
    chickengeprekgame.start();
})
btnplayagain.addEventListener('click', () => {
    chickengeprekgame.start();
})

