import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
	apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
	authDomain: `${process.env.REACT_APP_FIREBASE_PROJID}.firebaseapp.com`,
	databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJID}.firebaseio.com`,
	projectId: process.env.REACT_APP_FIREBASE_PROJID,
	storageBucket: `${process.env.REACT_APP_FIREBASE_PROJID}.appspot.com`,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.database();

export {
	db,
	auth,
};