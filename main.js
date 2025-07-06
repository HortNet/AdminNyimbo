import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCG_-UFFJ4jCaeFrFRDj8v1Q6QSnWtVOrc",
  authDomain: "nyimbo-64d23.firebaseapp.com",
  projectId: "nyimbo-64d23",
  storageBucket: "nyimbo-64d23.firebasestorage.app",
  messagingSenderId: "976903482180",
  appId: "1:976903482180:web:8125b31850f1e221654511",
  measurementId: "G-0KV815N7JP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getDownloadableLink(driveLink) {
  const match = driveLink.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  if (!match) return null;
  const fileId = match[1];
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

async function insertLinkToFirestore() {
  const msgEl = document.getElementById('message2');
  const number = document.getElementById("number2").value.trim();
  const originalLink = document.getElementById("link").value.trim();
  const link = getDownloadableLink(originalLink);

  if (!number || !originalLink) {
    msgEl.textContent = "Please fill in all fields before saving.";
    return;
  }

  if (!link) {
    msgEl.textContent = "Invalid link.";
    return;
  }

  msgEl.textContent = 'Saving...';

  try {
    const q = query(collection(db, "audios"), where("number", "==", parseInt(number)));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await setDoc(doc(db, "audios", docId), {
        number: parseInt(number),
        Link: link,
        isDeleted: false,
        timestamp: serverTimestamp()
      });
      msgEl.textContent = "Audio link updated successfully!";
    } else {
      const newDocRef = await addDoc(collection(db, "audios"), {
        number: parseInt(number),
        Link: link,
        isDeleted: false,
        timestamp: serverTimestamp()
      });
      msgEl.textContent = "Audio link added with ID: " + newDocRef.id;
    }
  } catch (error) {
    msgEl.textContent = "Error saving document: " + error.message;
  }
}

async function addNyimbo() {
  const msgEl = document.getElementById('message');
  const number = document.getElementById("number").value.trim();
  const title = document.getElementById("title").value.trim();
  const verse = document.getElementById("verse").value.trim();

  if (!number || !title || !verse) {
    msgEl.textContent = "Please fill in all fields before saving.";
    return;
  }

  msgEl.textContent = 'Saving...';

  try {
    const q = query(collection(db, "nyimbos"), where("number", "==", parseInt(number)));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await setDoc(doc(db, "nyimbos", docId), {
        number: parseInt(number),
        title: title,
        verse: verse,
        timestamp: serverTimestamp(),
        isDeleted: false
      });
      msgEl.textContent = "Nyimbo updated successfully!";
    } else {
      const newDocRef = await addDoc(collection(db, "nyimbos"), {
        number: parseInt(number),
        title: title,
        verse: verse,
        timestamp: serverTimestamp(),
        isDeleted: false
      });
      msgEl.textContent = "Nyimbo added successfully with ID: " + newDocRef.id;
    }
  } catch (error) {
    msgEl.textContent = "Error saving document: " + error.message;
  }
}

window.addNyimbo = addNyimbo;
window.insertLinkToFirestore = insertLinkToFirestore;
