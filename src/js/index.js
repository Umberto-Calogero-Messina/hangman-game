import '../scss/styles.scss';
import { WORDS } from './word';

const wordElement = document.getElementById('word');
// const trysElement = document.getElementById('trys');
const popUpElement = document.getElementById('subtitle');
const restartButton = document.getElementById('restart');
const hangmanDrawing = document.getElementById('hangman-drawing');
const regexLetters = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+$/;

let randomWord;
const guessedLetters = [];
let errorCount = 0;
const maxErrors = 6;
let gameOver = false;

const clearPopUp = () => {
  popUpElement.textContent = 'Escribe en el teclado la letra que quieras adivinar';
  popUpElement.classList.remove('pop-up--active');
};

const showPopUp = message => {
  popUpElement.textContent = message;
  popUpElement.classList.add('pop-up--active');
};

const createLetterSpan = (letter, isGuessed) => {
  const newSpan = document.createElement('span');

  if (letter === ' ') {
    newSpan.textContent = ' ';
  } else if (isGuessed) {
    newSpan.textContent = letter.toUpperCase();
    newSpan.classList.add('wordline--letter');
  } else {
    newSpan.textContent = '_';
    newSpan.classList.add('wordline');
  }

  return newSpan;
};

const writeWord = () => {
  wordElement.textContent = '';
  const fragment = document.createDocumentFragment();

  for (const letter of randomWord) {
    const isGuessed = guessedLetters.includes(letter);
    fragment.append(createLetterSpan(letter, isGuessed));
  }

  wordElement.append(fragment);
};

const updateKeyboardButton = (letter, isCorrect) => {
  const button = document.querySelector(`[data-key='${letter}']`);
  const correctLetter = isCorrect ? 'button--correct' : 'button--wrong';
  if (button) {
    button.classList.add(correctLetter);
  }
};

const hangmanParts = [
  { type: 'div', className: 'head' },
  { type: 'div', className: 'body' },
  { type: 'div', className: 'arm-left' },
  { type: 'div', className: 'arm-right' },
  { type: 'div', className: 'leg-left' },
  { type: 'div', className: 'leg-right' }
];

const drawHangmanPart = () => {
  if (errorCount > 0 && errorCount <= hangmanParts.length) {
    const part = hangmanParts[errorCount - 1];
    const element = document.createElement(part.type);
    element.className = `hangman-part ${part.className}`;
    hangmanDrawing.append(element);
    setTimeout(() => {
      element.classList.add('hangman-part--visible');
    }, 0);
  }
};

const checkForVictory = () => {
  return [...new Set(randomWord.toLowerCase().replace(/ /g, ''))].every(letter => guessedLetters.includes(letter));
};

const handleVictory = () => {
  wordElement.classList.add('correct_word');
  showPopUp('¡Has ganado! Felicitaciones.');
  gameOver = true;
};

const handleGameOver = () => {
  showPopUp(`Has alcanzado el número máximo de errores. La palabra era: ${randomWord.toUpperCase()}`);
  gameOver = true;
};

const processLetter = letter => {
  const lowerCaseLetter = letter.toLowerCase();

  if (guessedLetters.includes(lowerCaseLetter)) {
    return;
  }

  guessedLetters.push(lowerCaseLetter);

  if (randomWord.includes(lowerCaseLetter)) {
    updateKeyboardButton(lowerCaseLetter, true);
    wordElement.classList.add('bg--correct');
    setTimeout(() => wordElement.classList.remove('bg--correct'), 1000);

    if (checkForVictory()) {
      writeWord();
      drawHangmanPart();
      handleVictory();
      return;
    }
  } else {
    errorCount++;
    updateKeyboardButton(lowerCaseLetter, false);
    wordElement.classList.add('bg--wrong');
    setTimeout(() => wordElement.classList.remove('bg--wrong'), 1000);

    if (errorCount >= maxErrors) {
      writeWord();
      drawHangmanPart();
      handleGameOver();
      return;
    } else {
      drawHangmanPart();
    }
  }

  writeWord();
};

const handleKeyDown = event => {
  if (gameOver) return;

  const letter = event.key;

  if (letter.length === 1 && regexLetters.test(letter)) {
    processLetter(letter);
  }
};

const handleVirtualKeyboardClick = event => {
  if (gameOver) return;

  const button = event.target;
  const letter = button.dataset.key;

  if (letter.length === 1 && regexLetters.test(letter)) {
    processLetter(letter);
  }
};

const resetKeyboardClasses = () => {
  document.querySelectorAll('[data-key]').forEach(button => {
    button.classList.remove('button--correct', 'button--wrong');
  });
};

const restartTable = () => {
  guessedLetters.length = 0;
  errorCount = 0;
  gameOver = false;
  wordElement.classList.remove('correct_word');
};

const initializeGame = () => {
  randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];

  restartTable();
  // updateTrys();
  writeWord();
  clearPopUp();
  resetKeyboardClasses();
  hangmanDrawing.textContent = ''; // clear hangman parts
};

const addKeydownListener = () => {
  window.addEventListener('keydown', handleKeyDown);
};

const removeKeydownListener = () => {
  window.removeEventListener('keydown', handleKeyDown);
};

restartButton.addEventListener('click', () => {
  removeKeydownListener();
  initializeGame();
  addKeydownListener();
});

document.querySelectorAll('[data-key]').forEach(button => {
  button.addEventListener('click', handleVirtualKeyboardClick);
});

initializeGame();
addKeydownListener();
