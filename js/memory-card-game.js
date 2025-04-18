import { getUsers ,saveUsers,statuslogin, login } from "./auth.js";
const rawcards = ['assets/memory-pokemon-game/pikachu.png', 'assets/memory-pokemon-game/charizard.png', 'assets/memory-pokemon-game/charmander.png', 'assets/memory-pokemon-game/dragonair.png', 'assets/memory-pokemon-game/evee.png', 'assets/memory-pokemon-game/gengar.png', 'assets/memory-pokemon-game/squirtle.png', 'assets/memory-pokemon-game/umbreon.png'];
const datacards = [...rawcards, ...rawcards];

const containercardgame = document.getElementById('containercardgame');
const btnstartgame = document.getElementById('btnstartgame');
const resultgame = document.getElementById('resultgame');
const timerdisplay = document.getElementById('timerdisplay');
const users = getUsers();
const userlogin = statuslogin();
let timer = 60;
let firstcard = null;
let lockclick = false; // use for lock click if two card authencation
let statuswin = false;
let countsamechard = 0;
// console.log(card);
function startgame () {
    const shufflecards = datacards.sort(() => Math.random() - 0.5); // To shuffle array data in the database card, the default form ascending sort is .sort((a, b) => a - b). When a - b returns a positive value, the first element (a) is placed after the second (b). If the result is negative, the order remains unchanged.
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
        containercardgame.appendChild(cardelement);
    })

    timergame();
    function timergame () {
        if (!statuswin) {
            if (timer > 0) {
                timer --;
                timerdisplay.textContent = `timer: ${timer}`;
                setTimeout(timergame, 1000);
            }
            else {
                endgame(statuswin);
            }
        }
        else {
            return;
        }
    }

    const cards = document.querySelectorAll('#card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            if (lockclick || card.classList.contains('active')) {
                return;
            }
            else {
                if (!firstcard) {
                    card.classList.add('active');
                    firstcard = card;
                }
                else {
                    checkcard(card);
                }
            }
        })
    })
    function checkcard (card) {
        card.classList.add('active');
        const secondcard = card;
        const firstcardimg = firstcard.querySelector('img').src;
        const secondcardimg = secondcard.querySelector('img').src;
        if (firstcardimg == secondcardimg) {
            firstcard = null;
            countsamechard += 1;
            countsamechard == rawcards.length && endgame(statuswin = true);
        }
        else {
            lockclick = true;
            setTimeout (() => {
                firstcard.classList.remove('active');
                secondcard.classList.remove('active');
                firstcard = null;
                lockclick = false;
            }, 1000)
        }
    }

    function endgame (statuswin) {
        statuswin ? resultgame.textContent = 'YOU WIN' : resultgame.textContent = 'YOU LOSE';
        savedatagame (statuswin)
    }
    function reset () {
        cards.forEach(card => card.remove());
        countsamechard = 0;
        btnstartgame.style.display = '';
        btnstartgame.textContent = 'Play Again';
        resultgame.style.display = '';
        timerdisplay.textContent = "";
        timer = 60;
    }
    function savedatagame (statuswin) {
        if (userlogin) {
            const user = users.find(user => user.username == userlogin.username && user.password == userlogin.password);
            const pokemonmemorygame = user.pokemonmemorygame;
            statuswin ? pokemonmemorygame.win += 1 : pokemonmemorygame.lose += 1;
            pokemonmemorygame.tg += 1;
            saveUsers(users);
            login(user);
        }
        reset();
    }
    return;
}

btnstartgame.addEventListener('click', () => {
    btnstartgame.style.display = 'none';
    resultgame.style.display = 'none';
    statuswin = false;
    startgame();  
})

