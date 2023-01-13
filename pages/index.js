import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import Landing from "../components/Landing";
import ChatArea from "../components/ChatArea";
import Loading from "../components/Loading";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <Loading />;
  else if (!user) return <Landing />;
  else return <ChatArea user={user} />;
}
