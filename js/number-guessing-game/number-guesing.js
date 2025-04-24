import NumberGuessingGame from "./class-numberguessinggame.js";
// new NumberGuessingGame();
const numberguessinggame = new NumberGuessingGame();
const btnstart = numberguessinggame.btnstart;
const btnguess = numberguessinggame.btnguess;
const inptguess = numberguessinggame.inptguess;
const rangeguess = numberguessinggame.rangeguess;

rangeguess.addEventListener ('input', (x) => {
    let range = x.target.value;
    numberguessinggame.disablestart(range);
});
btnstart.addEventListener ('click', () => {
    numberguessinggame.startgame();
});
btnguess.addEventListener('click', () => {
    numberguessinggame.processguess(inptguess.value);
    inptguess.value = "";
});
inptguess.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        numberguessinggame.processguess(inptguess.value);
        inptguess.value = "";
    }
});
// export default NumberGuessingGame;


