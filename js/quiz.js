import { convertToEntity, shuffleArray, shuffleProperties, fade, incrementValue } from './helperFunctions.js';
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const QUIZMO = JSON.parse(localStorage.getItem('QUIZMO')) || {};

const question = $('.question');
const optionsBox = $('options');
const saveButton = $('.save');
const userName = $('.username');
const userDetails = $('.user__details');

const CORRECT_BONUS = 15,
      MAX_QUESTIONS = 5,
      MAX_HIGH_SCORES = 7,
      MAX_POSSIBLE_SCORE = MAX_QUESTIONS * CORRECT_BONUS;

const currentQuestionText = $('.quiz__info--container .current'),
      totalQuestionText = $('.quiz__info--container .total'),
      scoreText = $('.quiz__info--container .score'),
      quizProgressBar = $('.quiz__progress--bar'),
      quizProgressPercentage = $('.quiz__progress span');

let availableQuestions = [],
    currentQuestion = {},
    isAcceptingAnswers = false,
    questionCounter = 0,
    isQuizOver = false,
    score = 0;


let questions = [];

// General Questions
// https://opentdb.com/api.php?amount=15&category=9&difficulty=easy&type=multiple
// Anime & Manga
// https://opentdb.com/api.php?amount=15&category=31&difficulty=medium&type=multiple

fetch('https://opentdb.com/api.php?amount=15&category=31&difficulty=medium&type=multiple')
  .then(res =>  res.json())
  .then(loadedQuestions => {
    questions = loadedQuestions.results.map(loadedQuestion => {
      const { incorrect_answers: wrongOptions, correct_answer: rightOption, question } = loadedQuestion;
      const formattedQuestion = { question, options: {}, answer: null },
            options = [...wrongOptions, rightOption],
            letters = shuffleArray('abcd'.split(''));

      formattedQuestion.options = options.reduce((optionsObject, option) => {
        const optionIndex = Math.floor(Math.random() * letters.length);
        optionsObject[letters[optionIndex]] = option;
        letters.splice(optionIndex, 1);

        return optionsObject;
      }, {})

      Object.entries(formattedQuestion.options).forEach(pair => pair[+!![]] === rightOption && (formattedQuestion.answer = pair[+[]]));
      return formattedQuestion;
    })

    startQuiz();
  })
  .catch(error => console.error(`Error : : ${error}`))

HTMLElement.prototype.empty = function() {
  const element = this;
  while (element.hasChildNodes()) element.removeChild(element.lastChild);
}

const sounds = {
  correct: new Audio('../sounds/correct-beep.mp3'),
  incorrect: new Audio('../sounds/incorrect-beep.mp3'),
  gameOver: new Audio('../sounds/game-over.mp3')
}

const createOption = (option, content) => {
  return `<div class="option__container" data-option="${option}" oncontextmenu="return false;">
    <span class="option__select--icon"></span>
    <p class="option__text">${convertToEntity(content)}</p>
  </div>`;
}

const updateQuizState = () => {
  const quizPercentage = Math.round((questionCounter / MAX_QUESTIONS) * 100);
  const oldQuizPercentage = Math.round(((questionCounter - 1) / MAX_QUESTIONS) * 100);

  setTimeout(() => {
    quizProgressBar.style.width = `${quizPercentage}%`;
    incrementValue(quizPercentage, oldQuizPercentage, quizProgressPercentage, 35, 0);
    getQuestion();

    MAX_QUESTIONS > questionCounter && (isAcceptingAnswers = true);
  }, 1350)
}

const startQuiz = () => {
  if (availableQuestions.length !== 0) return console.warn('[!] A quiz is ongoing...');
  saveButton.addEventListener('click', saveScore);

  questionCounter = 0, score = 0, isQuizOver = false;
  userName.value = '', scoreText.innerText = 0;
  quizProgressBar.style.width = `0%`;
  quizProgressPercentage.innerText = 0;

  availableQuestions = [...questions];
  totalQuestionText.innerText = MAX_QUESTIONS;
  getQuestion();
  fade($('form'), 'in', 0, 'block');
  fade(userDetails, 'out');
  fade($('.preloader'), 'out');
}

const getQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    isQuizOver = true, availableQuestions = [], showQuizSummary();

    return false;
  }

  optionsBox.empty(); questionCounter++;
  currentQuestionText.innerText = questionCounter;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;

  for (const option in shuffleProperties(currentQuestion.options)) {
    optionsBox.insertAdjacentHTML('beforeend', createOption(option, currentQuestion.options[option]))
  }

  availableQuestions.splice(questionIndex, 1);
  isAcceptingAnswers = true;

  const options = $$('.option__container');
  options.forEach(option => {
    option.addEventListener('click', e => {
      if (isAcceptingAnswers && !isQuizOver) {
        isAcceptingAnswers = false;
        const selectedElement = e.target.closest('.option__container');
        const { option } = e.target.closest('.option__container').dataset;

        const optionState = option === currentQuestion.answer ? 'correct' : 'incorrect';
        selectedElement.classList.add(optionState);

        if (optionState === 'incorrect') {
          selectedElement.classList.add('headShake', 'animated'), sounds.incorrect.play();

          setTimeout(() => {
            $(`[data-option="${currentQuestion.answer}"`).classList.add('correct');
            updateQuizState();
          }, 1e3)
        } else {
          score += CORRECT_BONUS;
          incrementValue(score, score - CORRECT_BONUS, scoreText, 45, 450);
          sounds.correct.play(), updateQuizState();
        }
      }
    })
  })
}

const showQuizSummary = () => {
  setTimeout(() => {
    // Show quiz summary modal
    $('[quiz-summary]').classList.add('active');
    $('[quiz-summary]').closest('.modal-overlay').classList.add('active');
    sounds.gameOver.play();

    const confettiAnimation = setInterval(() => {
      party.screen({
        angleSpan: 0,
        count: 500 * (window.innerWidth / 1980),
        countVariation: 0.5,
        rotationVelocityLimit: 6,
        scaleVariation: 0.8,
        size: party.minmax(6, 10),
        yVelocity: -100,
        yVelocityVariation: 2
      });
    }, 500)

    setTimeout(() => clearInterval(confettiAnimation), 8e3);
    setTimeout(() => incrementValue(score, 0, $('.final-score'), 50, 0), 500);

    $('.restart').addEventListener('click', () => {
      clearInterval(confettiAnimation);
      $('[quiz-summary]').classList.remove('active');
      $('[quiz-summary]').closest('.modal-overlay').classList.remove('active');
      setTimeout(() => startQuiz(), 600);
    })
  }, 500)
}

userName.addEventListener('input', e => {
  // saveButton.toggleAttribute('disabled', !e.target.value.length);
  e.target.value = e.target.value.trim();
  saveButton.disabled = !/^[a-z0-9]+$/i.test(e.target.value);
})

const saveScore = e => {
  e.preventDefault();

  if (!QUIZMO.scores) QUIZMO.scores = [];
  QUIZMO.scores.push({ username: userName.value, score, maxPossibleScore: MAX_POSSIBLE_SCORE });
  QUIZMO.scores.sort((firstUser, nextUser) => nextUser.score - firstUser.score);
  QUIZMO.scores.splice(MAX_HIGH_SCORES);

  localStorage.setItem('QUIZMO', JSON.stringify(QUIZMO));

  fade($('form'), 'out', 0, 0, () => {
    $('[username]').innerText = userName.value;
    $('[score]').innerText = score;
    userName.value = '', saveButton.disabled = true;
    
    fade(userDetails, 'in', 0, 'flex');
  });
}

// const QUIZMO = {
//   scores: [...],
//   preferences: {
//     darkMode: false,
//     sound: true
//   }
// }