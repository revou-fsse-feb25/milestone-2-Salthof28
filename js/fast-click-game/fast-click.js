import FastClick from "./class-fastclick.js"

const fastclick = new FastClick();
const btnstart = fastclick.btnstart;
const btnclickme = fastclick.btnclickme;

btnstart.addEventListener('click', () => {
    fastclick.startgame();
});

btnclickme.addEventListener('click', () => {
    fastclick.countingscore();
})