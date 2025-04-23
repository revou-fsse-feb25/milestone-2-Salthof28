import { getUsers ,saveUsers,statuslogin, login } from "./auth.js";

class MemoryPokemonGame {
    constructor() {
        this.rawcards = ['assets/memory-pokemon-game/pikachu.png', 'assets/memory-pokemon-game/charizard.png', 'assets/memory-pokemon-game/charmander.png', 'assets/memory-pokemon-game/dragonair.png', 'assets/memory-pokemon-game/evee.png', 'assets/memory-pokemon-game/gengar.png', 'assets/memory-pokemon-game/squirtle.png', 'assets/memory-pokemon-game/umbreon.png'];
        this.datacards = [...this.rawcards, ...this.rawcards];
        this.initialTimer = 60;
        this.containercardgame = document.getElementById('containercardgame');
        this.btnstartgame = document.getElementById('btnstartgame');
        this.resultgame = document.getElementById('resultgame');
        this.timerdisplay = document.getElementById('timerdisplay');
        this.dataleaderboard = document.getElementById('dataleaderboard');
        this.howplaycontainer = document.getElementById('howplay');
        this.leaderboardcontainer = document.getElementById('leaderboard');
        this.users = getUsers();
        this.userlogin = statuslogin();
        this.timer = this.initialTimer;
        this.firstcard = null;
        this.lockclick = false; // use for lock click if two card authencation
        this.statuswin = false;
        this.countsamechard = 0;
        this.interval = null;
        this.leaderboardcontainer.style.display = 'none';
    }
    startgame () {
        this.resultgame.style.display = 'none';
        this.leaderboardcontainer.style.display = 'none';
        this.howplaycontainer.style.display = 'none';
        const shufflecards = this.datacards.sort(() => Math.random() - 0.5); // To shuffle array data in the database card, the default form ascending sort is .sort((a, b) => a - b). When a - b returns a positive value, the first element (a) is placed after the second (b). If the result is negative, the order remains unchanged.
        shufflecards.forEach((src) => {
            const cardelement = document.createElement('div');
            cardelement.id = 'card';
            const frontelement = document.createElement('div');
            frontelement.classList.add('front');
            const backelement = document.createElement('div');
            backelement.classList.add('back');
            const imgcard = document.createElement('img');
            imgcard.src = src
    
            backelement.appendChild(imgcard);
            cardelement.append(backelement, frontelement); // same appendChild but can made two child
            this.containercardgame.appendChild(cardelement);
        });

        const cards = document.querySelectorAll('#card');
        cards.forEach((card) => {
            card.addEventListener('click', () => {
                this.processgame(card)
            })
        });
        this.timerdisplay.textContent = `timer: ${this.timer}`;
        this.timergame();
    }
    processgame (card) {
        if (this.lockclick || card.classList.contains('active')) {
            return;
        }
        else {
            if (!this.firstcard) {
                card.classList.add('active');
                this.firstcard = card;
            }
            else {
                this.checkcard(card);
            }
        }
    }
    timergame () {
        this.interval = setInterval (() => {
            if (!this.statuswin) {
                if (this.timer > 0) {
                    this.timer --;
                    this.timerdisplay.textContent = `timer: ${this.timer}`;
                }
                else {
                    this.endgame(this.statuswin);
                    clearInterval(this.interval);
                }
            }
            else {
                clearInterval(this.interval);
            }
        }, 1000)
    }
    checkcard (card) {
        card.classList.add('active');
        const secondcard = card;
        const firstcardimg = this.firstcard.querySelector('img').src;
        const secondcardimg = secondcard.querySelector('img').src;
        if (firstcardimg == secondcardimg) {
            this.firstcard = null;
            this.countsamechard += 1;
            this.countsamechard == this.rawcards.length && this.endgame(this.statuswin = true);
        }
        else {
            this.lockclick = true;
            setTimeout (() => {
                this.firstcard.classList.remove('active');
                secondcard.classList.remove('active');
                this.firstcard = null;
                this.lockclick = false;
            }, 1000)
        }
    }
    endgame (statuswin) {
        statuswin ? this.resultgame.textContent = 'YOU WIN' : this.resultgame.textContent = 'YOU LOSE';
        this.savedatagame (statuswin)
    }
    savedatagame (statuswin) {
        if (this.userlogin) {
            const user = this.users.find(user => user.username === this.userlogin.username && user.password === this.userlogin.password);
            const pokemonmemorygame = user.pokemonmemorygame;
            statuswin ? pokemonmemorygame.win += 1 : pokemonmemorygame.lose += 1;
            pokemonmemorygame.tg += 1;
            saveUsers(this.users);
            login(user);
        }
        this.reset();
    }
    reset () {
        clearInterval(this.interval);
        const cards = document.querySelectorAll('#card');
        cards.forEach(card => card.remove());
        this.countsamechard = 0;
        this.btnstartgame.style.display = '';
        this.btnstartgame.textContent = 'Play Again';
        this.timerdisplay.textContent = "";
        this.resultgame.style.display = '';
        this.dataleaderboard.textContent = '';
        this.leaderboardcontainer.style.display = 'flex';
        this.timer = this.initialTimer;
        this.statuswin = false;
        this.leaderboard();
    }
    leaderboard () {
        if (this.users) {
            const userssort = this.users.sort ((a, b) => b.pokemonmemorygame.win - a.pokemonmemorygame.win);
            userssort.forEach((databaseusers, index) => {
                const username = databaseusers.username;
                const pokemonmemorygame = databaseusers.pokemonmemorygame;
                const trElement = document.createElement('tr');
                const tdIndex = document.createElement('td');
                tdIndex.textContent = index + 1;
                const tdUsername = document.createElement('td');
                tdUsername.textContent = username;
                const tdLose = document.createElement('td');
                tdLose.textContent = pokemonmemorygame.lose;
                const tdWin = document.createElement('td');
                tdWin.textContent = pokemonmemorygame.win; 
                trElement.append(tdIndex, tdUsername, tdLose, tdWin);
                this.dataleaderboard.appendChild(trElement);
            });
        }
    }
}

const memorypokemongame = new MemoryPokemonGame();
const btnstartgame = memorypokemongame.btnstartgame;

btnstartgame.addEventListener('click', () => {
    btnstartgame.style.display = 'none';
    memorypokemongame.startgame();
})

