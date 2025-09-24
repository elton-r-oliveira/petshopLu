// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcUjOjLbyzfn14lddbcpqQOVhY_pGWE0s",
  authDomain: "petshoplu-bd78f.firebaseapp.com",
  projectId: "petshoplu-bd78f",
  storageBucket: "petshoplu-bd78f.firebasestorage.app",
  messagingSenderId: "388078662924",
  appId: "1:388078662924:android:5d1e15086c242910288529"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta a autenticação
export const auth = getAuth(app);