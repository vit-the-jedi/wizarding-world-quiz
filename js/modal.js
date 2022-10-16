"use strict";

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

const closeModal = function (targetModal) {
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
export { openModal };
