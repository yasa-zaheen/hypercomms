import React, { useState, useEffect } from "react";

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
} from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import CustomInput from "../components/CustomInput";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import IconButton from "../components/IconButton";

function Id({ data }) {
  const [text, setText] = useState("");
  const [contact, setContact] = useState({});

  const [user, userLoading] = useAuthState(auth);
  const [room, roomLoading] = useDocument(doc(db, "rooms", data.id));
  const [messages, messagesLoading] = useCollection(
    query(collection(db, "messages"), where("room", "==", data.id))
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
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (text !== "") {
      await addDoc(collection(db, "messages"), {
        content: text,
        sent: serverTimestamp(),
        sender: user.email,
        room: room.id,
      });

      setText("");
    }
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
          <div className="flex-1">
            {messages?.docs.map((message) => (
              <p>{message.data().content}</p>
            ))}
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
