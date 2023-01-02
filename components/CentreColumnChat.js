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
import {
  useCollection,
  useCollectionData,
  useDocument,
} from "react-firebase-hooks/firestore";

import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
  const [messages] = useCollection(
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

    if (message.data().sender === user.email) {
      userSentMessage = true;
    }
    if (message.data().sender !== user.email) {
      userSentMessage = false;
    }

    // Determing the style of message
    let indexOfMessage = 0;

    for (let i = 0; i < messages.docs.length; i++) {
      if (messages.docs[i].id == message.id) {
        break;
      } else indexOfMessage++;
    }

    if (
      message.data().sender !== messages.docs[indexOfMessage - 1]?.data().sender
    ) {
      styleOfMessage = "last";
    }

    if (
      message.data().sender ===
        messages.docs[indexOfMessage - 1]?.data().sender &&
      message.data().sender === messages.docs[indexOfMessage + 1]?.data().sender
    ) {
      styleOfMessage = "middle";
    }

    if (
      message.data().sender !== messages.docs[indexOfMessage + 1]?.data().sender
    ) {
      styleOfMessage = "first";
    }

    if (
      message.data().sender !==
        messages.docs[indexOfMessage + 1]?.data().sender &&
      message.data().sender !== messages.docs[indexOfMessage - 1]?.data().sender
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
        replied: repliedMessage || null,
      });

      const userRef = doc(db, "users", user.email);

      if (repliedMessage) {
        await updateDoc(userRef, {
          points: increment(7),
        });
      } else {
        await updateDoc(userRef, {
          points: increment(5),
        });
      }

      scroller.current.scrollIntoView({ behavior: "smooth" });
      setText("");
      setRepliedMessage("");
    }
  };

  // Handling replied messages
  const [repliedMessage, setRepliedMessage] = useState();

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
        {messages?.docs.map((message) => (
          <Message
            message={message}
            style={getMessageStyle(message)}
            repliedMessage={repliedMessage}
            setRepliedMessage={setRepliedMessage}
          />
        ))}
      </div>
      {/* Input */}
      <form
        className="bg-green-50 rounded-xl p-4 flex flex-col"
        onSubmit={sendMessage}
      >
        {/* Replied message container */}
        <div
          className={`flex items-center space-x-4 ${
            repliedMessage ? "opacity-100 mb-4" : "h-0 opacity-0"
          } duration-200 ease-in-out`}
        >
          <IconButton
            Icon={XMarkIcon}
            className="bg-green-200"
            onClick={() => {
              setRepliedMessage();
            }}
          />
          <div>
            <p className="text-sm font-semibold">Replying to</p>
            <p className="text-xs opacity-75">{repliedMessage}</p>
          </div>
        </div>

        {/* Input container */}
        <div className="flex items-center space-x-4">
          <CustomInput
            placeholder={"Don't be shy, Say hi!"}
            value={text}
            setValue={setText}
            className="mt-0 rounded-xl bg-white p-3"
          />
          <IconButton
            Icon={PaperAirplaneIcon}
            className="bg-green-200"
            submit
          />
        </div>
      </form>
    </div>
  );
}

export default CentreColumnChat;
