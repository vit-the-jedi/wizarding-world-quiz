"use strict";
const initModal = document.querySelector("#init-modal");
const startButton = document.querySelector("#start-quiz");
const houseInfo = document.querySelector("#house-info");
const infoArea = document.querySelector(".info-area");
const houses = ["Slytherin", "Hufflepuff", "Gryffindor", "Ravenclaw"];
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

function startQuiz(house) {
  sorted = true;
  houseInfo.textContent = `${house}`;
  infoArea.setAttribute("selected-house", house);
  sessionStorage.setItem("sorted", sorted);
  sessionStorage.setItem("house", house);
  startButton.classList.remove("hidden");
  startButton.addEventListener("click", function () {
    closeModal(initModal);
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
