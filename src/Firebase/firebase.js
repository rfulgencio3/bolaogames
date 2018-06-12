import firebase from 'firebase/app';
import 'firebase/auth'

const config = {
	apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: "bolao-da-copa-9c243.firebaseapp.com",
    databaseURL: "https://bolao-da-copa-9c243.firebaseio.com",
    projectId: "bolao-da-copa-9c243",
    storageBucket: "bolao-da-copa-9c243.appspot.com",
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
    auth,
};