import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import Avatar from "./Avatar";
import Message from "./Message";
import CustomInput from "./CustomInput";
import IconButton from "./IconButton";

import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  increment,
  limit,
} from "firebase/firestore";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

function CentreColumnChat({ user }) {
  const router = useRouter();
  const scroller = useRef();

  // Fetching the contact
  const [contact, setContact] = useState({});
  const [room] = useDocument(doc(db, "rooms", router.query.roomId));
  useEffect(() => {
    // Extracts the information of the contact from the room document
    if (room) {
      if (room.data().userInfo[0].email === user.email) {
        setContact(room.data().userInfo[1]);
      } else {
        setContact(room.data().userInfo[0]);
      }
    }
  }, [room]);

  // Fetching the messsages
  const [messages] = useCollectionData(
    query(
      collection(db, `rooms/${router.query.roomId}/messages`),
      orderBy("sent", "desc"),
      limit(25)
    )
  );

  // Determining the style of the message
  const getMessageStyle = (message) => {
    let userSentMessage;
    let styleOfMessage;

    // Determining who sent the message
    if (message.sender === user.email) {
      userSentMessage = true;
    } else if (message.sender !== user.email) {
      userSentMessage = false;
    }

    // Determing the style of message
    const indexOfMessage = messages.indexOf(message);

    if (message.sender !== messages[indexOfMessage - 1]?.sender) {
      styleOfMessage = "last";
    }

    if (
      message.sender === messages[indexOfMessage - 1]?.sender &&
      message.sender === messages[indexOfMessage + 1]?.sender
    ) {
      styleOfMessage = "middle";
    }

    if (message.sender !== messages[indexOfMessage + 1]?.sender) {
      styleOfMessage = "first";
    }

    if (
      message.sender !== messages[indexOfMessage + 1]?.sender &&
      message.sender !== messages[indexOfMessage - 1]?.sender
    ) {
      styleOfMessage = "independent";
    }

    return {
      userSentMessage: userSentMessage,
      styleOfMessage: styleOfMessage,
    };
  };

  //   Handling user inputs
  const [text, setText] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();

    if (text !== "") {
      await addDoc(collection(db, `rooms/${room.id}/messages`), {
        content: text,
        sent: serverTimestamp(),
        sender: user.email,
        room: room.id,
      });

      scroller.current.scrollIntoView({ behavior: "smooth" });
      setText("");

      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        points: increment(5),
      });
    }
  };

  return (
    <div className="w-1/2 flex flex-col space-y-4 h-full">
      {/* Topbar */}
      <div className="bg-blue-50 rounded-xl p-4 flex items-center">
        <Avatar src={contact.photoURL} />
        <div className="flex flex-col ml-2 justify-around">
          <p className="text-sm">{contact.displayName}</p>
          <p className="text-xs opacity-50">{contact.email}</p>
        </div>
      </div>
      {/* Chats */}
      <div className="flex-1 flex flex-col-reverse  overflow-y-scroll rounded-xl scrollbar-hide">
        <div ref={scroller} className="h-4 bg-transparent"></div>
        {messages?.map((message) => (
          <Message message={message} style={getMessageStyle(message)} />
        ))}
      </div>
      {/* Input */}
      <form
        className="bg-green-50 rounded-xl p-4 flex items-center space-x-4"
        onSubmit={sendMessage}
      >
        <CustomInput
          placeholder={"Don't be shy, Say hi!"}
          value={text}
          setValue={setText}
          className="mt-0 rounded-xl bg-white p-3"
        />
        <IconButton Icon={PaperAirplaneIcon} className="bg-green-200" submit />
      </form>
    </div>
  );
}

export default CentreColumnChat;
