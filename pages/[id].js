import React, { useState, useEffect, useRef } from "react";

import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import ContactsPanel from "../components/ContactsPanel";
import Loading from "../components/Loading";
import Avatar from "../components/Avatar";
import {
  doc,
  serverTimestamp,
  addDoc,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  useCollection,
  useCollectionData,
  useDocument,
} from "react-firebase-hooks/firestore";
import CustomInput from "../components/CustomInput";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import IconButton from "../components/IconButton";
import Message from "../components/Message";

function Id({ data }) {
  const [text, setText] = useState("");
  const [contact, setContact] = useState({});
  const scroller = useRef();

  const [user, userLoading] = useAuthState(auth);
  const [room, roomLoading] = useDocument(doc(db, "rooms", data.id));
  const [messages, messagesLoading] = useCollectionData(
    query(collection(db, `rooms/${data.id}/messages`), orderBy("sent"))
  );

  useEffect(() => {
    if (room && user) {
      const roomData = room.data();
      if (roomData.userInfo[0].email === user.email) {
        setContact(roomData.userInfo[1]);
      } else {
        setContact(roomData.userInfo[0]);
      }
    }
  }, [room]);

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
    }
  };

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
      styleOfMessage = "first";
    }
    if (
      message.sender === messages[indexOfMessage - 1]?.sender &&
      message.sender === messages[indexOfMessage + 1]?.sender
    ) {
      styleOfMessage = "middle";
    }
    if (message.sender !== messages[indexOfMessage + 1]?.sender) {
      styleOfMessage = "last";
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

  if (userLoading || roomLoading) return <Loading />;

  if (user && room) {
    return (
      <div className="h-screen overflow-hidden flex p-4 space-x-4 rounded-xl">
        <ContactsPanel user={user} />
        {/* Right */}
        <div className="w-3/4 flex flex-col bg-gray-50 h-full rounded-xl">
          {/* Header */}
          <div className="p-4 shadow-sm flex items-center">
            <Avatar src={contact.photoURL} />
            <div className="flex flex-col ml-2 justify-around">
              <p className="text-sm">{contact.displayName}</p>
              <p className="text-xs opacity-50">{contact.email}</p>
            </div>
          </div>
          {/* Chat area */}
          <div className="flex-1 overflow-scroll p-4 rounded-3xl scrollbar-hide">
            {messages.map((message) => (
              <Message message={message} style={getMessageStyle(message)} />
            ))}
            <div ref={scroller} className="h-4 bg-transparent"></div>
          </div>
          {/* Input */}
          <form
            className="p-4 flex items-center space-x-4"
            onSubmit={sendMessage}
          >
            <CustomInput
              placeholder={"Don't be shy, Say hi!"}
              value={text}
              setValue={setText}
              className="mt-0 rounded-xl bg-gray-200 p-3"
            />
            <IconButton
              Icon={PaperAirplaneIcon}
              className="bg-blue-500 text-white"
              submit
            />
          </form>
        </div>
      </div>
    );
  }
}

export default Id;

export async function getServerSideProps(context) {
  const data = context.params;

  return {
    props: { data: data },
  };
}
