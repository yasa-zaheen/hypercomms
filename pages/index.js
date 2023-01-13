import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import Landing from "../components/Landing";
import ChatArea from "../components/ChatArea";
import Loading from "../components/Loading";
import Head from "next/head";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  return (
    <>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7299531318569051"
          crossorigin="anonymous"
        ></script>
      </Head>
      <body>
        {loading ? <Loading /> : !user ? <Landing /> : <ChatArea user={user} />}
        {}
      </body>
    </>
  );
}
