const $mainDiv = document.getElementById(`about`);
const $startBtn = document.getElementById(`start`);
const $aboutContainer = document.querySelectorAll(
  `section#main > div.container`
);
let round = 0; // each round will get harder
let qCount = 0; // question counter
let gameQs; // will hold all game qs
let correctA = 0;
let incorrectA = 0;

const startTrivia = () => {
  // console.log(`trivia started`);
  $mainDiv.setAttribute(`class`, `hide`);
  openTriviaReq();
};

const openTriviaURL = (round) => {
  let difficulty;
  switch (round) {
    case 0:
      difficulty = `easy`;
      break;
    case 1:
      difficulty = `medium`;
      break;
    case 2:
      difficulty = `hard`;
      break;
    default:
      console.log(`invalid round: ${round}`);
      return;
  }
  console.log(`difficulty:`, difficulty, round);
  return `https://opentdb.com/api.php?amount=3&category=18&difficulty=${difficulty}&type=multiple`;
};

const openTriviaReq = () => {
  let request = new XMLHttpRequest();
  const apiURL = openTriviaURL(round);
  request.open(`GET`, apiURL, true);
  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      const { results: questions } = JSON.parse(this.response);
      gameQs = questions;
      // console.log(gameQs);
      iterateQs(gameQs);
    } else {
      // We reached our target server, but it returned an error
      console.log(`RESPONSE ERROR`);
    }
  };
  request.onerror = function () {
    // There was a connection error of some sort
    console.log(`CONNECTION ERROR`);
  };
  request.send();
};

const iterateQs = (questions) => {
  // console.log(`iterateQs running`);
  if (qCount < questions.length) {
    const {
      correct_answer: correct,
      incorrect_answers: incorrect,
      question,
    } = questions[qCount];
    genQ(question, correct, incorrect);
  } else {
    endGame();
  }
};

const genQ = (q, correct, incorrect) => {
  const $qDiv = document.getElementById(`question`);
  if ($qDiv) {
    clearMain();
  }
  const $qContainer = document.createElement(`div`);
  $qContainer.setAttribute(`id`, `question`);
  const question = buildQ(q);
  const answers = buildAs(correct, incorrect);
  $qContainer.appendChild(question);
  $qContainer.appendChild(answers);
  //   console.log($aboutContainer[0]);
  $aboutContainer[0].appendChild($qContainer);
};

const clearMain = () => {
  $aboutContainer[0].innerHTML = ``;
}

const buildQ = (q) => {
  const $qTag = document.createElement(`p`);
  $qTag.innerHTML = q;
  return $qTag;
};

const buildAs = (correct, incorrect) => {
  let answers = shuffleArr([correct, ...incorrect]);
  let btnColors = shuffleArr([`yellow`, `green`, `blue`, `pink`]);
  let answersArr = [];
  let cleanCorrect = decodeHTML(correct);
  const $aDivTag = document.createElement(`div`);
  $aDivTag.setAttribute(`id`, `answerContainer`);
  answers.map((answer, i) => {
    const $buttonTag = document.createElement(`button`);
    $buttonTag.setAttribute(`class`, `answerBtn ${btnColors[i]}`);
    $buttonTag.innerHTML = answer;
    $buttonTag.addEventListener(`click`, (e) => {
      e.preventDefault();
      let target = e.target;
      let targetText = e.target.innerHTML;
      // console.log(`target:`, target);
      // console.log(`correct:`, correct);
      // console.log(`cleanCorrect:`, cleanCorrect);
      // console.log(targetText === cleanCorrect ? true : false);
      // console.log(incorrect);
      disableBtns(cleanCorrect);
      targetText === cleanCorrect ? rightA(target) : wrongA(target);
    });
    answersArr.push($buttonTag);
  });
  answersArr.forEach((answer) => $aDivTag.appendChild(answer));
  return $aDivTag;
};

const disableBtns = (correct) => {
  const $aBtns = document.querySelectorAll(`button.answerBtn`);
  // console.log($aBtns);
  $aBtns.forEach(btn => {
    let thisColor = btn.className.split(` `)[1];
    btn.disabled = true;
    if (btn.innerText === correct) {
      btn.classList.add(`correct`);
      btn.style.backgroundColor = `#669953`;
    }
  });
};

const returnHex = (color) => {
  switch (color) {
    case `yellow`:
      return `#dcdcaa`;
      break;
    case `green`:
      return `#6a9955`;
      break;
    case `blue`:
      return `#569cd6`;
      break;
    case `pink`:
      return `#c586c0`;
      break;
    default:
      console.log(`invalid color entry into returnHex`)
      break;
  }
}

const wrongA = (target) => {
  target.classList.add(`incorrect`);
  // console.log(`passed target:`, target)
  console.log(`wrong answer`);
  incorrectA++;
  addEvaluation("Wrong");
};

const rightA = (target) => {
  // console.log(`passed target:`, target)
  console.log(`right answer`);
  correctA++;
  addEvaluation("Right");
};

const addEvaluation = (eval) => {
  // console.log(`add evaluation running`);
  const $pEval = document.createElement(`p`);
  $pEval.innerText = `${eval} answer!`;
  $aboutContainer[0].appendChild($pEval);
  nextQ(gameQs);
}

const nextQ = (questions) => {
  // console.log(`nextQ running`);
  qCount++;
  iterateQs(gameQs);
}

const endGame = () => {
  clearMain();
  // console.log(`end of game`);
  console.log(`  wins:`, correctA, `| losses:`, incorrectA);
  const $resultsContainer = document.createElement(`div`);
  $resultsContainer.setAttribute(`id`, `results`);
  const $requestsTag = document.createElement(`p`);
  $resultsContainer.innerHTML = `${Math.round((correctA / 3) * 100)}%`;
  let $btnContainer = buildBtnContainer();
  $resultsContainer.appendChild($requestsTag);
  $resultsContainer.appendChild($btnContainer);
  $aboutContainer[0].appendChild($resultsContainer);
}

const buildBtnContainer = () => {
  const $btnDivTag = document.createElement(`div`);
  $btnDivTag.setAttribute(`id`, `btnContainer`);
  let $againBtn = buildReplayBtn(`Again`);
  let $nextBtn = buildReplayBtn(`Next Round`);
  $btnDivTag.appendChild($againBtn);
  if (round < 2) {
    $btnDivTag.appendChild($nextBtn);
  }
  return $btnDivTag;
}

const buildReplayBtn = (btnText) => {
  // console.log(round);
  const $btnTag = document.createElement(`button`);
  $btnTag.setAttribute(`class`, `next`);
  $btnTag.innerHTML = `Play ${btnText} <i class="material-icons">chevron_right</i>`;
  $btnTag.addEventListener(`click`, (e) => {
      e.preventDefault();
      let thisBtn = e.target.innerHTML;
      if (thisBtn.includes(`Next`)) {
        round++;
        console.log(round);
      }
      // console.log(`next button clicked`);
      nextRound();
    });
  return $btnTag;
}

const nextRound = () => {
  console.log(`round:`, round);
  if (round < 3) {
    qCount = 0; // reset question counter
    gameQs.length = 0; // empty game Qs array
    correctA = 0; // reset correct As
    incorrectA = 0; // reset incorrect Qs
    clearMain();
    openTriviaReq();
  } else {
    console.log(`round:`, round);
  }
}

/* Knuth Shuffle source:
    https://github.com/Daplie/knuth-shuffle/blob/master/index.js
*/
const shuffleArr = (arr) => {
  let currentIndex = arr.length;
  let temporaryValue;
  let randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }
  return arr;
};

/* Decoding HTML characters source:
    https://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it/7394787#7394787
*/
const decodeHTML = (html) => {
  const txt = document.createElement(`textarea`);
  txt.innerHTML = html;
  return txt.value;
};

// run when all DOM content loaded
document.addEventListener(`DOMContentLoaded`, () => {
  // listen for clicks on start button

  // won't add for highscores page
  if ($startBtn) {
    $startBtn.addEventListener(`click`, (e) => {
      e.preventDefault();
      startTrivia();
    });
  }
});
