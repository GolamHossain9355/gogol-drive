import { initializeApp, FirebaseOptions } from "firebase/app"
import { getAuth, Persistence } from "firebase/auth"
import {
   getFirestore,
   collection,
   serverTimestamp,
   DocumentSnapshot,
   DocumentData,
} from "firebase/firestore"
import { Prettify } from "./utils/typeHelper"
import { getStorage } from "firebase/storage"

export const persistanceNone: Prettify<Persistence> = {
   type: "SESSION",
}

const {
   VITE_FIREBASE_API_KEY,
   VITE_FIREBASE_APP_ID,
   VITE_FIREBASE_AUTH_DOMAIN2,
   VITE_FIREBASE_MESSAGING_SENDER_ID,
   VITE_FIREBASE_PROJECT_ID,
   VITE_FIREBASE_STORAGE_BUCKET,
   // VITE_FIREBASE_DATABASE_ID,
} = import.meta.env

const firebaseConfig: Prettify<FirebaseOptions> = {
   apiKey: VITE_FIREBASE_API_KEY,
   authDomain: VITE_FIREBASE_AUTH_DOMAIN2,
   projectId: VITE_FIREBASE_PROJECT_ID,
   storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
   appId: VITE_FIREBASE_APP_ID,
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)

const fireStore = getFirestore(firebaseApp)
export const databaseCollections = {
   folders: collection(fireStore, "folders"),
   files: collection(fireStore, "files"),
   currentTimeStamp: serverTimestamp(),
   formatDoc: <T>(
      doc: DocumentSnapshot<DocumentData, DocumentData>
   ): T & { id: string } => {
      return {
         id: doc.id,
         ...(doc.data() as T),
      }
   },
}

export const storage = getStorage(firebaseApp)
