import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import Landing from "../components/Landing";
import Chat from "../components/Chat";
import Loading from "../components/Loading";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <Loading />;
  else if (!user) return <Landing />;
  else return <Chat user={user} />;
}
