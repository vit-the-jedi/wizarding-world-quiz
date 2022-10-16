"use strict";

//firebase stuff
import {
  firebaseConfig,
  app,
  db,
  getLeaderboardData,
  addToFirestore,
} from "../modules/db.js";

const leaderboardOutput = document.querySelector("#leaderboard");
leaderboardOutput.classList.add("data-output");
leaderboardOutput.classList.add("leaderboard--output");

async function populateLeaderboard() {
  //get leaderboard from firebase
  const leaderboardDataFromFB = await getLeaderboardData(db);
  const heading = document.createElement("h3");
  heading.textContent = "Quiz Leaderboard";
  leaderboardOutput.prepend(heading);
  //append data to leaderboard
  let count = 0;
  for (const obj of leaderboardDataFromFB) {
    console.log(obj);
    for (const [username, userData] of Object.entries(obj)) {
      count++;
      const newRow = createRow("leaderboard", count);
      newRow.textContent = `${username}: ${userData.score}`;
      leaderboardOutput.appendChild(newRow);
    }
  }
  leaderboardOutput.style.display = "flex";
}
//utility to create rows for data output
//pass in the context of our data, to be used as a unique identifier
//pass in index to increment
const createRow = (context, index) => {
  const row = document.createElement("div");
  row.classList.add("data-row");
  row.classList.add(`${context}--data`);
  row.id = `${context}-data-${index}`;
  return row;
};

async function addToLeaderboard() {
  const docName = sessionStorage.getItem("username");
  const leaderboardData = {
    score: Number(sessionStorage.getItem("score")),
    country: "",
  };
  await addToFirestore("leaderboard", docName, leaderboardData);
}

//modal utilities

let btnCloseModal;
let modalState = "closed";
const overlay = document.querySelector(".overlay");
const body = document.querySelector("body");
body.setAttribute("modal-state", modalState);
const openModal = function (targetModal) {
  modalState = "open";
  body.setAttribute("modal-state", modalState);
  targetModal.classList.remove("hidden");
  targetModal.classList.add("modal-fade-in");
  targetModal.classList.remove("modal-fade-out");
  overlay.classList.remove("hidden");
  btnCloseModal = targetModal.querySelector(".close-modal");
  btnCloseModal.addEventListener("click", function () {
    closeModal(targetModal);
  });
};

const closeModal = async function (targetModal) {
  modalState = "closed";
  body.setAttribute("modal-state", modalState);
  targetModal.classList.add("modal-fade-out");
  targetModal.classList.remove("modal-fade-in");
  //🛑 will probably need to change this
  //bad design bc i could change the animation timing on modal-fade css class and then this 1000 ms would fire at the wrong time
  setTimeout(function () {
    targetModal.classList.add("hidden");
    overlay.classList.add("hidden");
  }, 1000);
  return modalState;
};

overlay.addEventListener("click", function () {
  const activeModal = document.querySelector(".modal-fade-in");
  closeModal(activeModal);
});

document.addEventListener("keydown", function (e) {
  const activeModal = document.querySelector(".modal-fade-in");

  if (e.key === "Escape" && !activeModal.classList.contains("hidden")) {
    closeModal(activeModal);
  }
});

//main app

let count = sessionStorage.getItem("question") ?? 1;
let score = Number(sessionStorage.getItem("score")) ?? 0;
let questionMap;
const scoreOutput = document.getElementById("score");
const questionOutput = document.getElementById("question");
const promptArea = document.getElementById("answers");
const messageModal = document.querySelector("#message-modal");

const questionsMap = new Map([
  [
    "question-1",
    {
      question: "What is Harry Potter's pet owl's name?",
      options: [
        [1, "Hypogriff"],
        [2, "Dereck"],
        [3, "Hedwig"],
      ],
      correct: 3,
      true: 1,
      false: 1,
    },
  ],
  [
    "question-2",
    {
      question: "What is Lord Voldemort's birth name?",
      options: [
        [1, "Keith Richards"],
        [2, "Rubius Crouch"],
        [3, "Tom Riddle"],
      ],
      correct: 3,
      true: 2,
      false: 1,
    },
  ],
  [
    "question-3",
    {
      question: "Who impersonated Mad Eye Moody in the Goblet of Fire?",
      options: [
        [1, "Barty Crouch"],
        [2, "Barty Crouch Jr."],
        [3, "Viktor Krum"],
      ],
      correct: 2,
      true: 3,
      false: 2,
    },
  ],
  [
    "question-4",
    {
      question: "What is Dumbledore's full name?",
      options: [
        [1, "Albus Christhanthimum Nebolt Dumbledore"],
        [2, "Albosi Dumbledore"],
        [3, "Albus Percival Wulfric Brian Dumbledore"],
        [4, "Albus Wulfric Kevin Dumbledore"],
      ],
      correct: 3,
      true: 4,
      false: 3,
    },
  ],
  [
    "question-5",
    {
      question: "Why did Hagrid get expelled from Hogwarts?",
      options: [
        [1, "Using underage magic"],
        [2, "Flunking out"],
        [3, "Violating the dress code"],
        [4, "Keeping a forbidden pet"],
      ],
      correct: 4,
      true: 5,
      false: 4,
    },
  ],
  [
    "question-6",
    {
      question: "What tool does Dumbledore use to view memories?",
      options: [
        [1, "Pensieve"],
        [2, "His wand"],
        [3, "Looking glass"],
        [4, "Triphonalator"],
      ],
      correct: 1,
      true: 6,
      false: 7,
    },
  ],
  [
    "question-7",
    {
      question: "What is Harry's wand's core made of?",
      options: [
        [1, "Wormtail"],
        [2, "Pheonix Feather"],
        [3, "Dragon Heart String"],
        [4, "Willow brush"],
      ],
      correct: 2,
      true: 7,
      false: 8,
    },
  ],
  [
    "question-8",
    {
      question: "What town do the Dursley's live in?",
      options: [
        [1, "Bag End"],
        [2, "Little Whinging"],
        [3, "Cornwall"],
        [4, "Birmingham"],
      ],
      correct: 2,
      true: 8,
      false: 9,
    },
  ],
  [
    "question-9",
    {
      question: "Where can you find Ravenclaw's lost diadem?",
      options: [
        [1, "On the ghost of Ravenclaw's head"],
        [2, "In Dumbledore's office"],
        [3, "Harry's Gringott's vault"],
        [4, "The Room of Requirement"],
      ],
      correct: 4,
      true: 9,
      false: 10,
    },
  ],
  [
    "question-10",
    {
      question: "Who are Harry's 3 roommates in Gryffindor?",
      options: [
        [1, "Ron, James, and Neville"],
        [2, "Neville, Seamus, and Colin"],
        [3, "Ron, Neville, and Seamus"],
        [4, "Jordan, Colin, Ron"],
      ],
      correct: 3,
      true: 10,
      false: 11,
    },
  ],
  [
    "question-11",
    {
      question: "Who is the ghost of Ravenclaw?",
      options: [
        [1, "Rawena Ravenclaw"],
        [2, "Hermosa Lestrange"],
        [3, "Helena Ravenclaw"],
      ],
      correct: 1,
      true: 11,
      false: 12,
    },
  ],
  [
    "question-12",
    {
      question:
        "In the tales of Beedle and the Bard, what are the 3 Deathly Hallows?",
      options: [
        [
          1,
          "Cloak of Invisibility, the Resurrection Stone, and the Elder Wand",
        ],
        [
          2,
          "The Elder Wand, the Sorcerer's Stone, and the Cloak of Invisibility",
        ],
        [3, "The Resurrection Stone, the Sword of Gryffindor, the Elder Wand"],
      ],
      correct: 1,
      true: 12,
      false: 13,
    },
  ],
  [
    "question-13",
    {
      question: "Who killed Bellatrix Lestrange?",
      options: [
        [1, "Neville Longbottom"],
        [2, "Harry Potter"],
        [3, "Molly Weasley"],
      ],
      correct: 3,
      true: 12,
      false: 13,
    },
  ],
  [
    "question-14",
    {
      question:
        "What dragon does Viktor Krum face off against during the first challenge in the Tri-Wizard Tournament?",
      options: [
        [1, "Norwegian Ridgeback"],
        [2, "Hungarian Horntail"],
        [3, "Swedish Fireball"],
        [4, "Chinese Fireball"],
      ],
      correct: 4,
      true: 14,
      false: 15,
    },
  ],
  [
    "question-15",
    {
      question:
        "What is the vine-like plant that traps Ron, Harry, and Hermione during the quest for the Sorcerer's Stone?",
      options: [
        [1, "Devil's Snare"],
        [2, "Gillyweed"],
        [3, "Womping Willow"],
        [4, "Mandrake"],
      ],
      correct: 1,
      true: 15,
      false: 16,
    },
  ],
]);

const askUser = function (questionObj) {
  const answerOutput = document.getElementById("answers");
  const questionNum = document.getElementById("question-num");
  questionNum.textContent = `Question ${count}`;
  questionOutput.textContent = questionObj.question;
  //get answers and populate
  for (const [key, answer] of questionObj.options) {
    const container = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");
    container.classList.add("answer-div");
    label.textContent = answer;
    input.type = "radio";
    input.value = key;
    input.id = answer;
    input.setAttribute("name", "answer");
    label.setAttribute("for", answer);
    container.appendChild(input);
    container.appendChild(label);
    answerOutput.appendChild(container);
  }
  const continueBtn = document.createElement("button");
  continueBtn.setAttribute("role", "button");
  continueBtn.textContent = "Continue";
  continueBtn.addEventListener("click", function () {
    btnHandler(questionObj);
  });
  answerOutput.appendChild(continueBtn);
};

function startPrompts() {
  const progressBar = document.querySelector("progress");
  const questionNum = sessionStorage.getItem("question") ?? 1;
  const question = questionsMap.get(`question-${questionNum}`);
  const leaderboardOutput = document.querySelector("#leaderboard");
  progressBar.max = questionsMap.size;
  progressBar.value = questionNum;
  scoreOutput.textContent = score;
  sessionStorage.setItem("score", score);
  if (!question) {
    finishPrompts();
  } else {
    leaderboardOutput.style.display = "none";
    removePrevQuestion();
    askUser(question);
  }
}

//used handler function so I could pass the value as a parameter to the checkAnswer function
//also so I could pass the map along to the checkAnswer func as well
function btnHandler(obj) {
  const choice = document.querySelector('input[name="answer"]:checked');
  if (!choice) {
    return;
  } else {
    const answerVal = Number(choice.value);
    checkAnswer(answerVal, obj);
  }
}

function removePrevQuestion() {
  questionOutput.textContent = "";
  while (promptArea.firstChild) {
    promptArea.removeChild(promptArea.lastChild);
  }
}

const showAnswerMessage = function (bool, obj) {
  const message = document.getElementById("message");
  const messageImg = document.getElementById("message-img");
  const falseImgArray = [
    "false-1.gif",
    "false-2.gif",
    "false-3.gif",
    "false-4.gif",
  ];
  const trueImgArray = ["true-1.gif", "true-2.gif", "true-3.gif", "true-4.gif"];
  //show true message
  const userHouse = sessionStorage.getItem("house") ?? "your house";
  if (bool) {
    message.textContent = `Correct! 
    ${obj[bool.toString()]} point(s) to ${userHouse}!`;
    generateRandImg(trueImgArray, messageImg);
  }
  //show false message
  else {
    message.textContent = `Inorrect! 
    ${obj[bool.toString()]} point(s) taken away from ${userHouse}`;
    generateRandImg(falseImgArray, messageImg);
  }
  openModal(messageModal);
  removePrevQuestion();
};
async function finishPrompts() {
  const promptContainer = document.getElementById("prompt-container");
  await addToLeaderboard();
  while (promptContainer.firstChild) {
    promptContainer.removeChild(promptContainer.lastChild);
  }
  await populateLeaderboard();
  const itemsToClear = ["prompt", "answers"];
  clearStorage(itemsToClear);
}
const generateRandImg = function (arr, img) {
  const max = arr.length - 1;
  const randNum = Math.floor(Math.random() * (max - 0 + 1) + 0);
  const imgSrc = arr[randNum];
  const credits = new Map([
    [
      "false-1.gif",
      "https://giphy.com/gifs/harry-potter-voldemort-lord-Wrd8QwEkxh5Re",
    ],
    ["false-2.gif", "https://giphy.com/gifs/funny-harry-potter-aU4jau5ql99EA"],
    [
      "false-3.gif",
      "https://giphy.com/gifs/harry-potter-hermione-granger-ronald-weasley-pI2paNxecnUNW",
    ],
    ["false-4.gif", "https://giphy.com/gifs/vote-tpwwhv1BLd31e"],
    ["true-1.gif", "https://giphy.com/gifs/funny-f-clap-Gyb7Mrx7jlGF2"],
    [
      "true-2.gif",
      "https://giphy.com/gifs/harry-potter-swag-swagger-12TPnF37sliyJi",
    ],
    ["true-3.gif", "https://giphy.com/gifs/hagrid-7hnNiwfkYsPFC"],
    ["true-4.gif", "https://giphy.com/gifs/dumbledore-9H279yb0blggo"],
  ]);
  const imgCredit = document.getElementById("img-credit");
  img.src = `images/${imgSrc}`;
  imgCredit.textContent = `Source: ${credits.get(imgSrc)}`;
};

//remove animation classes
function animatePointsClassHandler() {
  const pointsAnimation = document.querySelector(".points-animation");
  const pointsAnimationClassList = [...pointsAnimation.classList];
  const scoreText = document.querySelector("#score-text");
  for (const clas of pointsAnimationClassList) {
    if (clas.includes("add-points") || clas.includes("remove-points")) {
      pointsAnimation.classList.remove(clas);
      scoreText.classList.remove("score-animation");
    }
  }
}

const drawPoints = function (callback) {
  const drawPointsCanvas = document.querySelector("#drawPoints-canvas");
  const canvasParent = document.querySelector(".canvas-container");
  const canvasWidth = canvasParent.getBoundingClientRect().width;
  //fixed height + width for the points area
  drawPointsCanvas.setAttribute("width", Math.floor(canvasWidth / 2.5));
  drawPointsCanvas.setAttribute("height", `115`);
  drawPointsCanvas.style.clipPath =
    "polygon(0% 0%, 100% 0, 99% 72%, 50% 100%, 0 73%);";
  const drawPointsCanvasWidth = drawPointsCanvas.getBoundingClientRect().width;
  const drawPointsCanvasHeight =
    drawPointsCanvas.getBoundingClientRect().height;
  let context = drawPointsCanvas.getContext("2d");
  context.fillStyle = "#ffff00";
  let pointsToDraw = score > 0 ? score : 0;
  const pointSize = 15;
  //create tiers for where points are placed
  //start at pointSize so they dont clip thru bottom
  let pointsYAxisMax;
  if (score >= 0 && score <= 33) {
    pointsYAxisMax = 33;
  } else if (score <= 66) {
    pointsYAxisMax = 66;
  } else if (score >= 67 && score <= drawPointsCanvasHeight) {
    pointsYAxisMax = drawPointsCanvasHeight;
  }
  //loop through each point and draw
  // subtract 1 because of 0 based indexing
  for (let i = 0; i < pointsToDraw; i++) {
    let pointsImg = new Image();
    //random y pos between the tier threshold
    const pointsYPos = Math.random() * (pointsYAxisMax - pointSize) + pointSize;
    pointsImg.src = "images/point.png";
    //draw our points img
    pointsImg.onload = function () {
      const randXpos = Math.floor(
        Math.random() * (drawPointsCanvasWidth - pointSize) -
          pointSize +
          pointSize
      );
      context.drawImage(
        pointsImg,
        //x axis pos
        randXpos,
        //y axis pos
        drawPointsCanvasHeight - pointsYPos,
        //width
        pointSize,
        //height
        pointSize
      );
    };
  }
  setTimeout(() => {
    callback(animatePointsClassHandler);
  }, 1000);
};

const checkAnswer = function (val, obj) {
  const userAnswerBool = val == obj.correct;
  //convert boolean to string
  const points = obj[userAnswerBool.toString()];
  showAnswerMessage(userAnswerBool, obj);
  //add points animation
  const pointsAnimation = document.querySelector(".points-animation");
  const scoreText = document.querySelector("#score-text");
  //if true add points
  if (userAnswerBool) {
    score = score += points;
    pointsAnimation.classList.add("add-points");
  } else {
    score = score -= points;
    pointsAnimation.classList.add("remove-points");
  }
  scoreText.classList.add("score-animation");
  scoreOutput.textContent = score;
  drawPoints(animatePointsClassHandler);
  //update the question number and increment count
  //safe to do here because we have completed the logic for the previous question
  sessionStorage.setItem("score", score);
  count++;
  sessionStorage.setItem("question", count);
  //start prompts again
  startPrompts();
};

function clearStorage(arr) {
  for (let o = 0; o < arr.length; o++) {
    sessionStorage.clear(arr[o]);
  }
}
await populateLeaderboard();
function handleTextArea(event) {
  const targetInput = event.target;
  const textArea = document.querySelector(".text-input");

  if (textArea) {
    if (targetInput.id === "other") {
      textArea.classList.remove("hidden");
    } else {
      textArea.classList.add("hidden");
    }
  }
}

startPrompts();

//initialize app

const initModal = document.querySelector("#init-modal");
const startButton = document.querySelector("#start-quiz");
const houseInfo = document.querySelector("#house-info");
const infoArea = document.querySelector(".info-area");
const houses = ["Slytherin", "Hufflepuff", "Gryffindor", "Ravenclaw"];
const usernameInput = document.querySelector("#username-input");
let previousHouse = [];
let sorted = sessionStorage.getItem("sorted") ?? false;

//🛑need to look into how the "random" functions work - seem to have repeat values sometimes
const getRandHouse = function () {
  const max = houses.length - 1;
  let randNum = Math.floor(Math.random() * (max - 0 + 1) + 0);
  if (houses[randNum] === previousHouse[previousHouse.length - 1]) {
    randNum = Math.floor(Math.random() * (max - 0 + 1) + 0);
  }
  //   console.log(randNum);
  return houses[randNum];
};

//pass in callback so we can start the quiz after the user has been sorted
function sortUser(callback) {
  const houseOutput = document.querySelector("#house-output");
  const houseImg = document.querySelector("#house-img");
  let callbackCounter = 0;
  for (let i = 0; i < houses.length * 2; i++) {
    (function (index) {
      setTimeout(function () {
        let randHouse = getRandHouse();
        if (randHouse === previousHouse[previousHouse.length - 1]) {
          randHouse = getRandHouse();
        }
        previousHouse.push(randHouse);
        houseOutput.textContent = `${randHouse}!`;
        houseImg.setAttribute("selected-house", randHouse);
        //increment callback counter until loop is done
        callbackCounter++;
        //once loop is done we can invoke callback and move forward
        if (callbackCounter == houses.length * 2) {
          houseInfo.textContent = `${randHouse}`;
          infoArea.setAttribute("selected-house", randHouse);
          callback(randHouse);
        }
      }, i * 400);
    })(i);
  }
}
const initCanvas = function () {
  const canvas = document.getElementById("points");
  const canvasParent = document.querySelector(".canvas-container");
  const canvasWidth = canvasParent.getBoundingClientRect().width;
  const canvasHeight = canvasParent.getBoundingClientRect().height;
  let context = canvas.getContext("2d");
  //relative width + height for points chalice
  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasHeight);
  let pointsBgImg = new Image();
  pointsBgImg.src = "images/points-bg.png";
  //draw our points img
  pointsBgImg.onload = function () {
    context.drawImage(
      pointsBgImg,
      //x axis pos
      0,
      //y axis pos
      0,
      //width
      canvasWidth,
      //height
      canvasHeight
    );
  };
  // drawPoints(animatePointsClassHandler);
};
function startQuiz(house) {
  sorted = true;
  houseInfo.textContent = `${house}`;
  infoArea.setAttribute("selected-house", house);
  sessionStorage.setItem("sorted", sorted);
  sessionStorage.setItem("house", house);
  usernameInput.addEventListener("keyup", function () {
    console.log(this.value.length);
    if (this.value.length > 5) {
      startButton.classList.remove("hidden");
      startButton.addEventListener("click", function () {
        sessionStorage.setItem("username", usernameInput.value);
        closeModal(initModal);
      });
    } else {
      startButton.classList.add("hidden");
    }
  });

  initCanvas();
}

const init = function () {
  const houseMessage = document.querySelector("#house-message");
  openModal(initModal);
  houseMessage.textContent = `You've been placed in...`;

  sortUser(startQuiz);
  //🛑need to set up async functions to await the end of house sorting before hiding modal
  //   initModal.classList.add("hidden");
};
if (!sorted) {
  init();
} else {
  const house = sessionStorage.getItem("house");
  startQuiz(house);
}
window.addEventListener("resize", initCanvas);
