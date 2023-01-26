import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import ChatArea from "../components/ChatArea";
import Loading from "../components/Loading";
import Head from "next/head";
import SignIn from "./signIn";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap"
          rel="stylesheet"
        ></link>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7299531318569051"
          crossorigin="anonymous"
        ></script>
      </Head>
      <main>
        {loading ? <Loading /> : !user ? <SignIn /> : <ChatArea user={user} />}
        {}
      </main>
    </>
  );
}
