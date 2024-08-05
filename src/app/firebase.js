import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAMnmaEy9Bo5WY9LcaKvEIQFOxTLm6TjDo",
    authDomain: "doggy-4b553.firebaseapp.com",
    projectId: "doggy-4b553",
    storageBucket: "doggy-4b553.appspot.com",
    messagingSenderId: "323225998332",
    appId: "1:323225998332:web:dc4d1e5ee236d60d4c9879",
    measurementId: "G-BHPZXFL0KJ"
 };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };