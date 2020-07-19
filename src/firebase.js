import * as firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/auth';
import 'firebase/storage';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBoBquSjKeL2ulSnFPvQ-1EV5IsgxYAgJ8",
  authDomain: "instagram-clone-react-firebase.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-firebase.firebaseio.com",
  projectId: "instagram-clone-react-firebase",
  storageBucket: "instagram-clone-react-firebase.appspot.com",
  messagingSenderId: "701904083861",
  appId: "1:701904083861:web:97330f4bd129026381349c",
  measurementId: "G-WP3K59PP2G",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export  {db,auth,storage};
