const $startBtn = document.getElementById(`start`);
const round = 0;

const startTrivia = () => {
  console.log(`trivia started`);
};

// run when all DOM content loaded
document.addEventListener(`DOMContentLoaded`, () => {
  // listen for clicks on start button
  $startBtn.addEventListener(`click`, (e) => {
    e.preventDefault();
    startTrivia();
  });
});
