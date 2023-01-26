import Image from "next/image";
import { useRouter } from "next/router";

import Loading from "../components/Loading";
import TextButton from "../components/TextButton";

import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import signInPic from "../public/signIn.jpg";

function SignIn() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  if (loading) return <Loading />;
  else if (user) router.push("/");

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        await setDoc(
          doc(db, "users", result.user.email),
          {
            lastSeen: serverTimestamp(),
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            uid: result.user.uid,
          },
          { merge: true }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="h-screen w-full space-x-4 overflow-hidden flex p-4 bg-white text-black ">
      <div className="w-full rounded-xl overflow-hidden flex flex-col justify-center md:w-1/2">
        <p className="text-3xl font-semibold">Welcome to Eden!</p>
        <p className="text-md">The true successor to hyperchat 😉</p>
        <TextButton
          text="Sign in with google"
          className={
            "my-4 bg-blue-50 text-blue-500 border-2 border-blue-500 dark:border-blue-300 hover:bg-blue-500 hover:text-white active:brightness-95"
          }
          onClick={signInWithGoogle}
        />
        <div className="p-4 rounded-xl flex items-center justify-center flex-col">
          <p className="text-md">Made by Yasa Zaheen</p>
          <div className="flex space-x-2 text-xs underline opacity-75">
            <a href="https://www.instagram.com/yasazaheen">instagram</a>
            <a href="https://www.github.com/yasa-zaheen">github</a>
          </div>
        </div>
      </div>
      <div className="w-1/2 rounded-xl relative overflow-hidden hidden md:block">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/hypercomms-30a3a.appspot.com/o/Screenshot%20(170).png?alt=media&token=871f728f-a75e-4151-9a3e-6caa16803f72"
          alt="Sign in picture"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default SignIn;
