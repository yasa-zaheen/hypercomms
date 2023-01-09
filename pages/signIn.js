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
        await updateDoc(doc(db, "rooms", "wDregPmEJcZmRjl675aL"), {
          users: arrayUnion(result.user.email),
          userInfo: arrayUnion({
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            uid: result.user.uid,
          }),
        });

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
    <div className="h-screen w-full space-x-4 overflow-hidden flex p-4 ">
      <div className="w-1/3 bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold">Welcome to hypercomms!</p>
        <p className="text-sm font-light">The true successor to hyperchat 😉</p>
        <TextButton
          text="Sign in with google"
          className={
            "m-4 bg-blue-50 text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white active:brightness-95"
          }
          onClick={signInWithGoogle}
        />
      </div>
      <div className="w-2/3 rounded-xl relative block overflow-hidden">
        <Image
          src={signInPic}
          alt="Sign in picture"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default SignIn;
