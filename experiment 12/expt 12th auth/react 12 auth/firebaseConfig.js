import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7F6URKMbW5YV0Tyh4hRQ8gGz2tWmTmK0",
  authDomain: "expt12-app.firebaseapp.com",
  projectId: "expt12-app",
  storageBucket: "expt12-app.firebasestorage.app",
  messagingSenderId: "772024985095",
  appId: "1:772024985095:web:cc49690f65d4b06522aca2"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


export default app;
//772024985095-h1tmpoben6a0eal78ic1m7t0tv9dscrc.apps.googleusercontent.com(expo client id)
//772024985095-91ou5gjpj0uds0faefatn2k2gdft6b7j.apps.googleusercontent.com(expo android id)
//  