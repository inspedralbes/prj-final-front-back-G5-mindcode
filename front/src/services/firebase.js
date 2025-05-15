import { initializeApp } from "firebase/app";
import { GoogleAuthProvider,signInWithPopup,getAuth,signInWithRedirect } from "firebase/auth";
import { loginGoogle } from "services/communicationManager.js";

const privkey = process.env.NEXT_PUBLIC_API_KEY;

const firebaseConfig = {
  apiKey: privkey,
  authDomain: "mind-code1.firebaseapp.com",
  projectId: "mind-code1",
  storageBucket: "mind-code1.firebasestorage.app",
  messagingSenderId: "170796916073",
  appId: "1:170796916073:web:bf3f51e731f4db905ff1f8",
  measurementId: "G-HP3CWCKL3F",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

export const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const uid = user.uid;
    const name = user.displayName;
    const gmail = user.email;

    if (!gmail.endsWith("@inspedralbes.cat")) {
      console.log("Incorrect Credentials");
      return null;
    }

    const userData = await loginGoogle(uid, name, gmail);
    return userData;

  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};
