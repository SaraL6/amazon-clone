import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyC4e6jqoRPGo7DNLlZA-HJyiE_k6sfJELY",
    authDomain: "clone-2d894.firebaseapp.com",
    projectId: "clone-2d894",
    storageBucket: "clone-2d894.appspot.com",
    messagingSenderId: "492493636127",
    appId: "1:492493636127:web:554c28ae8bd1f4bbaf4b2a"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { db, auth };