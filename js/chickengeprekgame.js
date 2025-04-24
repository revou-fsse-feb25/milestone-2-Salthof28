import { getUsers ,saveUsers,statuslogin, login } from "./auth.js";

class ChickenGeprekGame {
    constructor () {
        this.object = [{name: 'knife', src: 'assets/chicken-geprek-game/knife.png'}, {name: 'dedak', src: 'assets/chicken-geprek-game/dedak.png'}, {name: 'cobek', src: 'assets/chicken-geprek-game/cobek.png'}];
        this.startposition = 50
        this.movestep = 2.5;
        this.settingspawninterval = 1000;
        this.initialFallspeed = 2;
        this.clearobject = 500;
        this.playerPosition = this.startposition;

        this.gamestarted = false;
        this.spawninterval = null;
        this.pointinterval = null;
        this.survivepointinterval = null;
        this.dedakscore = false;
        this.fallspeed = 2;
        this.score = 0;
        this.life = 3;

        this.player = document.getElementById('player');
        this.gameBox = document.getElementById('gameBox');
        this.containerWidth = this.gameBox.offsetWidth;
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

        this.player.style.display = 'none';
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
        this.life = 3;
        this.fallspeed = this.initialFallspeed;
        this.player.style.left = `${this.playerPosition}%`;
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
        this.disableenablekeydown();
        this.playerPosition = this.startposition;
        this.player.style.display = 'none';
        // this.btnstart.style.display = '';
        this.gameoverdisplay.style.display = 'flex';
        this.finalscoredisplay.textContent = `Score: ${this.score}`;
        this.score = 0;
        this.fallspeed = this.clearobject;
        this.settingspawninterval = 1000;
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

