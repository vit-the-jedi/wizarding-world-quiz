"use strict";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

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
  // const docRef = doc(db, "leaderboard", "scores");
  // const docSnap = await getDoc(docRef);
  const scoreCollection = collection(db, "leaderboard");
  // const scoreDoc = await getDoc(db, scoreCollection, "scores");
  // console.log(scoreDoc);
  //const data = docSnap.data().score_data;
  const orderedDataQuery = query(
    scoreCollection,
    orderBy("score", "desc"),
    limit(25)
  );
  const orderedData = await getDocs(orderedDataQuery);
  //order data highest -> lowest
  let dataArr = [];
  orderedData.forEach((doc) => {
    //create empty obj to store values
    const nestedDataObj = {};
    nestedDataObj[doc.id] = doc.data();
    //push to array so we can preserve the correct order we got from firebase query
    dataArr.push(nestedDataObj);
  });
  console.log(dataArr);
  return dataArr;
}
async function addToFirestore(coll, docName, data = null) {
  const docRef = doc(db, "leaderboard", docName);
  setDoc(docRef, data, { merge: true })
    .then(() => {
      console.log("Document has been added successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}
export { firebaseConfig, app, db, getLeaderboardData, addToFirestore };
