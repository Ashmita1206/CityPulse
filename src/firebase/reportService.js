import { db, storage } from './config';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload media + store report
export async function addReport({ file, description, location, aiTag }) {
  const fileRef = ref(storage, `reports/${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);

  await addDoc(collection(db, 'reports'), {
    description,
    location,
    aiTag,
    mediaUrl: downloadURL,
    timestamp: serverTimestamp(),
  });
}

// Fetch all reports
export async function getReports() {
  const snapshot = await getDocs(collection(db, 'reports'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
} 