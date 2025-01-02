// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
// 사용할 파이어베이스 서비스 주석을 해제합니다
//import "firebase/compat/auth";
import "firebase/database";
//import "firebase/compat/firestore";
//import "firebase/compat/functions";
import "firebase/compat/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANrTR0avqh99Rgr4b6VPS3WiN41H_-y2o",
  authDomain: "cleanhouse-51b07.firebaseapp.com",
  projectId: "cleanhouse-51b07",
  storageBucket: "cleanhouse-51b07.appspot.com",
  messagingSenderId: "996562465948",
  appId: "1:996562465948:web:59a48edb71789577916959",
  measurementId: "G-KFHXFZ10RL"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

//export const firebase_db = firebase.database();