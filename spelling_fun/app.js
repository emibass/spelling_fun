const words = [
  { word: "APPLE", picture: "🍎" },
  { word: "CAT", picture: "🐱" },
  { word: "DOG", picture: "🐶" },
  { word: "SUN", picture: "☀️" },
  { word: "BALL", picture: "⚽" },
  { word: "FISH", picture: "🐟" },
  { word: "TREE", picture: "🌳" },
  { word: "CAR", picture: "🚗" },
  { word: "SHOES", picture: "👟👟" },
  { word: "BOAT", picture: "🚤" },
  { word: "ORANGE", picture: "🍊" },
  { word: "FLAMINGO", picture: "🦩" },
  { word: "AIRPLANE", picture: "✈️" },
  { word: "BUS", picture: "🚌" },
  { word: "BOOK", picture: "📘" },
  { word: "PHONE", picture: "📱" },
  { word: "FRIES", picture: "🍟" },
  { word: "GRAPES", picture: "🍇" },
  { word: "COAT", picture: "🧥" },
  { word: "YES", picture: "👍" },
  { word: "NO", picture: "👎" },
  { word: "TRAIN", picture: "🚆" },
  { word: "PENGUIN", picture: "🐧" },
  { word: "BEE", picture: "🐝" },
  { word: "BIRD", picture: "🐦" },
  { word: "SCOOTER", picture: "🛴" },
  { word: "HELMET", picture: "🚴" }
];


let currentIndex = 0;
let typed = "";

const picture = document.getElementById("picture");
const answerSlots = document.getElementById("answerSlots");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const scoreText = document.getElementById("scoreText");
const soundBtn = document.getElementById("soundBtn");
const clearBtn = document.getElementById("clearBtn");
const nextBtn = document.getElementById("nextBtn");

const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"];

function currentWord() {
  return words[currentIndex].word;
}

function updateScore() {
  scoreText.textContent = `${currentIndex + 1} / ${words.length}`;
}

function drawSlots() {
  answerSlots.innerHTML = "";
  const word = currentWord();

  for (let i = 0; i < word.length; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.textContent = typed[i] || "";
    answerSlots.appendChild(slot);
  }
}

function drawKeyboard() {
  keyboard.innerHTML = "";
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  let colorIndex = 0;

  rows.forEach(rowLetters => {
    const row = document.createElement("div");
    row.className = "keyboard-row";

    rowLetters.split("").forEach(letter => {
      const button = document.createElement("button");
      button.className = `key key-${colors[colorIndex % colors.length]}`;
      button.textContent = letter;
      button.type = "button";
      button.addEventListener("click", () => addLetter(letter));
      row.appendChild(button);
      colorIndex++;
    });

    keyboard.appendChild(row);
  });
}

function addLetter(letter) {
  if (typed.length >= currentWord().length) {
    return;
  }

  const expectedLetter = currentWord()[typed.length];

  if (letter === expectedLetter) {
    speakLetter(letter);
    typed += letter;
    message.textContent = "";
    message.className = "message";
    drawSlots();

    if (typed === currentWord()) {
      setTimeout(() => {
        celebrateCorrect();
      }, 1000);
    }
  } else {
    setTimeout(() => {
      playWrongSound();
    }, 1000);

    message.textContent = "Oops, try another letter 🙂";
    message.className = "message try-again";
  }
}

function clearAnswer() {
  typed = "";
  message.textContent = "";
  message.className = "message";
  drawSlots();
}

function celebrateCorrect() {
  message.textContent = "Great job! 🎉";
  message.className = "message correct";
  playCelebrateSound();
}

function nextWord() {
  currentIndex = (currentIndex + 1) % words.length;
  typed = "";
  picture.textContent = words[currentIndex].picture;
  message.textContent = "";
  message.className = "message";
  updateScore();
  drawSlots();
  speakWord();
}

function getBritishVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(voice => voice.lang === "en-GB") ||
    voices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith("en-gb")) ||
    voices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith("en")) ||
    null
  );
}

function speakText(text, rate = 0.75) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = rate;
    utterance.pitch = 1.1;

    const britishVoice = getBritishVoice();
    if (britishVoice) {
      utterance.voice = britishVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

function speakLetter(letter) {
  speakText(letter, 0.65);
}

function speakWord() {
  speakText(currentWord().toLowerCase(), 0.75);
}

function playWrongSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(180, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(90, audioContext.currentTime + 0.22);

  gainNode.gain.setValueAtTime(0.18, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.25);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.25);
}

function playCelebrateSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();

  const notes = [523.25, 659.25, 783.99];

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    const startTime = audioContext.currentTime + index * 0.12;

    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.36);
  });
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();

  if (/^[A-Z]$/.test(key)) addLetter(key);

  if (event.key === "Backspace") {
    typed = typed.slice(0, -1);
    message.textContent = "";
    drawSlots();
  }

});

soundBtn.addEventListener("click", speakWord);
clearBtn.addEventListener("click", clearAnswer);
nextBtn.addEventListener("click", nextWord);

picture.textContent = words[currentIndex].picture;
updateScore();
drawSlots();
drawKeyboard();


// Some browsers load speech voices after the page opens.
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getBritishVoice();
  };
}
