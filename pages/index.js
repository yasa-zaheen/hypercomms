import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import Landing from "../components/Landing";
import ChatArea from "../components/ChatArea";
import Loading from "../components/Loading";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  const betaTesters = [
    "1001017@sfxghis.school",
    "yasazaheen728@gmail.com",
    "yasazaheen@gmail.com",
    "alishazia158@gmail.com",
    "anusreeajitabh@gmail.com",
    "samaraellin@gmail.com",
    "knahian77@gmail.com",
    "laurenquiah@gmail.com",
    "halimanahita@gmail.com",
    "apurbozunaid@gmail.com",
    "saminibteda@gmail.com",
    "tahsinkabir05@gmail.com",
    "ariana105025@gmail.com",
    "anjonn2200@gmail.com",
    "imfariztgk@gmail.com",
    "shreasarion@gmail.com",
    "falco8114@gmail.com",
    "abrarcls.5g@gmail.com",
    "prithwilubdhakpsl@gmail.com",
    "nazaha.0708@gmail.com",
    "tpmgodguin@gmail.com",
    "lamiyazahin17@gmail.com",
    "fuad.quazi2004@gmail.com",
    "zarahkhondoker@gmail.com",
  ];

  if (loading) return <Loading />;
  else if (!user) return <Landing />;

  if (betaTesters.includes(user.email)) {
    return <ChatArea user={user} />;
  } else {
    return alert(
      "Hey! It looks like you are not an enlisted beta tester. Maybe it's a bug, or maybe you didn't share your email in the Instagram story, either way let me (Yasa) know through Instagram DMs and we'll find a solution for it!"
    );
  }
}
