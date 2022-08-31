"use strict";

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
  progressBar.max = questionsMap.size;
  progressBar.value = questionNum;
  scoreOutput.textContent = score;
  sessionStorage.setItem("score", score);
  if (!question) {
    finishPrompts();
  } else {
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
    console.log(pointsYPos);
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

function finishPrompts() {
  const promptContainer = document.getElementById("prompt-container");
  const scoreArea = document.getElementById("score-area");
  const answerArray = JSON.parse(sessionStorage.getItem("answers"));
  const replayMessage = document.createElement("p");

  while (promptContainer.firstChild) {
    promptContainer.removeChild(promptContainer.lastChild);
  }

  const calcScore = function (arr) {
    const reducer = (prevValue, currValue) => prevValue + currValue;
    const score = arr.reduce(reducer);
    return Number(score);
  };

  const finalScore = calcScore(answerArray);
  sessionStorage.setItem("final-score", JSON.stringify(finalScore));
  const scoreText = document.createElement("p");
  scoreText.classList.add("score-text");

  scoreArea.appendChild(scoreText);
  replayMessage.textContent = `${finalScore} Please refresh your browser to take the quiz again.`;
  scoreArea.appendChild(replayMessage);

  const itemsToClear = ["prompt", "answers"];
  clearStorage(itemsToClear);
}

function clearStorage(arr) {
  for (let o = 0; o < arr.length; o++) {
    sessionStorage.clear(arr[o]);
  }
}

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

const config = { attributes: true };
const body = document.querySelector("body");
// Callback function to execute when mutations are observed
const modalListener = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes") {
      const attr = mutation.attributeName;
      // if (attr === "modal-state" && attr)
    } else if (mutation.type === "attributes") {
      console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};
const observer = new MutationObserver(modalListener);
observer.observe(body, config);

startPrompts();
window.addEventListener("resize", initCanvas);
