"use strict";

import { firebaseConfig, app, db, getLeaderboardData } from "../modules/db.js";

const leaderboardOutput = document.querySelector("#leaderboard");
leaderboardOutput.classList.add("data-output");
leaderboardOutput.classList.add("leaderboard--output");
// const leaderboardHeader = document.createElement("h2");
// leaderboardHeader.classList.add("data-output-header");
// leaderboardHeader.textContent = `Leaderboard`;
// leaderboardOutput.prepend(leaderboardHeader);
//utility to create rows for data output
//pass in the context of our data, to be used as a unique identifier
//pass in index to increment
const createRow = (context, index) => {
  const row = document.createElement("div");
  row.classList.add("data-row");
  row.classList.add(`${context}--data`);
  row.id = `${context}-data-${index + 1}`;
  return row;
};

//get leaderboard from firebase
const leaderboard = await getLeaderboardData(db);
//append data to leaderboard
leaderboard.forEach((data, i, arr) => {
  console.log(data);
  const newRow = createRow("leaderboard", i);
  newRow.textContent = `${Object.keys(data)}: ${Object.values(data)}`;
  leaderboardOutput.prepend(newRow);
});
