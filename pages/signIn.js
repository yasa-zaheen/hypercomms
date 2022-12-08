import Image from "next/image";
import signInPic from "../public/signIn.jpg";

import TextButton from "../components/TextButton";

function SignIn() {
  return (
    <div className="h-screen w-full space-x-4 overflow-hidden flex p-4 ">
      <div className="w-1/3 bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold">Welcome to hypercomms!</p>
        <p className="text-sm font-light">The true successor to hyperchat 😉</p>
        <TextButton text="Sign in with google" className={"m-4"} />
      </div>
      <div className="w-2/3 bg-blue-500 rounded-xl relative block overflow-hidden">
        <Image
          src={signInPic}
          alt="Picture of the author"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default SignIn;
