import ChickenGeprekGame from "./class-chickengeprekgame.js";
const chickengeprekgame = new ChickenGeprekGame();
const btnstart = chickengeprekgame.btnstart;
const btnplayagain = document.getElementById('btnplayagain');
const leftmove = document.getElementById('leftmove');
const rightmove = document.getElementById('rightmove');

btnstart.addEventListener('click', () => {
    chickengeprekgame.start();
});
btnplayagain.addEventListener('click', () => {
    chickengeprekgame.start();
});

leftmove.addEventListener('click', () => {
    const key = "ArrowLeft";
    chickengeprekgame.movechicken(key)
});
rightmove.addEventListener('click', () => {
    const key = "ArrowRight"
    chickengeprekgame.movechicken(key)
});