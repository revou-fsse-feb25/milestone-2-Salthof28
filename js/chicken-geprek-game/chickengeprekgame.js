import ChickenGeprekGame from "./class-chickengeprekgame.js";
const chickengeprekgame = new ChickenGeprekGame();
const btnstart = chickengeprekgame.btnstart;
const btnplayagain = document.getElementById('btnplayagain');

btnstart.addEventListener('click', () => {
    chickengeprekgame.start();
})
btnplayagain.addEventListener('click', () => {
    chickengeprekgame.start();
})

