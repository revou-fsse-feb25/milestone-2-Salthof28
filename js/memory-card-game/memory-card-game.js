import MemoryPokemonGame from "./class-memorycardgame.js";

const memorypokemongame = new MemoryPokemonGame();
const btnstartgame = memorypokemongame.btnstartgame;

btnstartgame.addEventListener('click', () => {
    btnstartgame.style.display = 'none';
    memorypokemongame.startgame();
})

