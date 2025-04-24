import RockScissorPaper from "./class-rockpaperscissorgame.js";

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