"use strict";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUmrpBDkr_-I8_GjVCNz0m-_5HJYxwTbs",
  authDomain: "wizarding-world-quiz.firebaseapp.com",
  projectId: "wizarding-world-quiz",
  storageBucket: "wizarding-world-quiz.appspot.com",
  messagingSenderId: "621588066883",
  appId: "1:621588066883:web:b85da9cb8ba08e53795af6",
  measurementId: "G-63JL5F47QG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getLeaderboardData(db) {
  const userDataCol = collection(db, "user-data");
  const userDataSnapshot = await getDocs(userDataCol);
  const userDataList = userDataSnapshot.docs.map((doc) => doc.data());
  console.log(userDataList);
  return userDataList;
}

export { firebaseConfig, app, db, getLeaderboardData };
