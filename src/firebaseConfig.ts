import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAcUjOjLbyzfn14lddbcpqQOVhY_pGWE0s",      // Encontrado no arquivo google-services.json
  authDomain: "petshoplu-bd78f.firebaseapp.com",          // Gerado pelo Firebase é o Project ID + o dominio do Firebase
  projectId: "petshoplu-bd78f",                           // ID do projeto encontrado no Firebase ou no google-services.json
  storageBucket: "petshoplu-bd78f.firebasestorage.app",   // Encontrado no arquivo google-services.json
  messagingSenderId: "388078662924",                      // Número do projeto encontrado no Firebase ou no google-services.json
  appId: "1:388078662924:android:5d1e15086c242910288529"  // ID do aplicativo encontrado no Firebase
};

const app = initializeApp(firebaseConfig);                // Inicializa o Firebase

export const auth = getAuth(app);                         // Exporta a autenticação
export const db = getFirestore(app);                      // banco de dados
export const storage = getStorage(app); 