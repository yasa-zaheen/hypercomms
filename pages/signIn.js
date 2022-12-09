import { useRouter } from "next/router";
import Image from "next/image";

import TextButton from "../components/TextButton";

import { auth } from "../firebase";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

import signInPic from "../public/signIn.jpg";

function SignIn() {
  const router = useRouter();

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push("/");
    } else {
      return (
        <div className="h-screen w-full space-x-4 overflow-hidden flex p-4 ">
          <div className="w-1/3 bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold">Welcome to hypercomms!</p>
            <p className="text-sm font-light">
              The true successor to hyperchat 😉
            </p>
            <TextButton
              text="Sign in with google"
              className={"m-4"}
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
  });
}

export default SignIn;
