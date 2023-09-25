import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIRE_KEY,
    authDomain: "charsight.firebaseapp.com",
    projectId: "charsight",
    storageBucket: "charsight.appspot.com",
    messagingSenderId: "584689086213",
    appId: "1:584689086213:web:375ccf6216b87079dc516c"
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export default firebase;