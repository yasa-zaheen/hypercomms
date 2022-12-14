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

import {
  BellAlertIcon,
  PaperAirplaneIcon,
  Squares2X2Icon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function CentreColumnChat({ user, setViewRight, setViewLeft }) {
  const router = useRouter();
  const scroller = useRef();

  // Fetching room information
  const [room] = useDocument(doc(db, "rooms", router.query.roomId));

  const displayName = room?.data().groupChatName
    ? room?.data().groupChatName
    : room?.data()?.userInfo[0].email === user.email
    ? room?.data().userInfo[1].displayName
    : room?.data().userInfo[0].displayName;

  const email =
    room?.data()?.userInfo[0].email === user.email
      ? room?.data().userInfo[1].email
      : room?.data().userInfo[0].email;

  const displayPicture =
    room?.data()?.userInfo[0].email === user.email
      ? room?.data().userInfo[1].photoURL
      : room?.data().userInfo[0].photoURL;

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

    const sentTime = serverTimestamp();
    const inputText = text;
    setText("");

    if (text !== "") {
      const messageRef = await addDoc(
        collection(db, `rooms/${room.id}/messages`),
        {
          content: inputText,
          sent: sentTime,
          sender: user.email,
          room: room.id,
          replied: repliedMessage || null,
          reactions: [],
        }
      );

      const userRef = doc(db, "users", user.email);

      // Points for replied message
      if (repliedMessage) {
        await updateDoc(userRef, {
          points: increment(7),
        });
      } else {
        await updateDoc(userRef, {
          points: increment(5),
        });
      }

      // Updating the last message
      const roomRef = doc(db, "rooms", router.query.roomId);
      await updateDoc(roomRef, {
        lastSentMessage: {
          content: inputText,
          sent: sentTime,
          sender: user.displayName,
        },
      });

      scroller.current.scrollIntoView({ behavior: "smooth" });
      setRepliedMessage("");
    }
  };

  // Handling replied messages
  const [repliedMessage, setRepliedMessage] = useState();

  return (
    <div className="w-full md:w-1/2 flex flex-col overflow-scroll scrollbar-hide p-4 md:py-0 h-full">
      {/* Topbar */}
      <div className="bg-blue-50 rounded-xl p-4 flex items-center">
        <Avatar src={displayPicture} />
        <div className="flex flex-col ml-2 justify-around">
          <p className="text-sm">{displayName}</p>
          {!room?.data().groupChatName ? (
            <p className="text-xs opacity-50">{email}</p>
          ) : null}
        </div>
        <div className="flex-1"></div>
        <IconButton
          Icon={Squares2X2Icon}
          onClick={() => {
            router.push("/");
          }}
          className={"bg-blue-200 md:hidden"}
        />
        <IconButton
          Icon={TrophyIcon}
          onClick={() => {
            setViewRight(true);
          }}
          className={"bg-blue-200 mx-2 md:hidden"}
        />
        <IconButton
          Icon={BellAlertIcon}
          onClick={() => {
            setViewLeft(true);
          }}
          className={"bg-blue-200 md:hidden"}
        />
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
            user={user}
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
            className="mt-0 rounded-xl bg-white p-3 text-lg"
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
