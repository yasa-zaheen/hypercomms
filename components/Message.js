import React from "react";

import Avatar from "./Avatar";
import IconButton from "./IconButton";

import sentTimeAgo from "../functions/sentTimeAgo";

import { db } from "../firebase";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { ArrowUturnLeftIcon, TrashIcon } from "@heroicons/react/24/outline";

function Message({ message, style, setRepliedMessage, user }) {
  const { userSentMessage, styleOfMessage } = style;

  const [customUser] = useDocumentData(doc(db, "users", message.data().sender));

  // Setting the roundness of the message
  let messageStyle = `w-full flex flex-col cursor-pointer ${
    userSentMessage
      ? "bg-rose-500 items-end"
      : "bg-gray-100 text-black items-start"
  } w-fit px-4 py-2 text-white rounded-3xl ease-in-out`;
  switch (styleOfMessage) {
    case "first":
      messageStyle += userSentMessage ? " rounded-br-none" : " rounded-bl-none";
      break;
    case "middle":
      messageStyle += userSentMessage ? " rounded-r-none" : " rounded-l-none";
      break;
    case "last":
      messageStyle += userSentMessage ? " rounded-tr-none" : " rounded-tl-none";
      break;
    case "independent":
      messageStyle += " rounded-3xl";
      break;
  }

  // Handling replied messages
  const replytoMessage = (message) => {
    setRepliedMessage(message);
  };

  // Handling deleted messages
  const deleteMessage = async () => {
    await deleteDoc(
      doc(db, `rooms/${message.data().room}/messages`, message.id)
    );
  };

  // Handling liked messages
  const likeMessage = async () => {
    const messageRef = doc(
      db,
      `rooms/${message.data().room}/messages`,
      message.id
    );

    if (message.data().reactions?.includes(user.email)) {
      await updateDoc(messageRef, {
        reactions: arrayRemove(user.email),
      });
    } else {
      await updateDoc(messageRef, {
        reactions: arrayUnion(user.email),
      });
    }

    // Updating points

    // Set the "capital" field of the city 'DC'
    await updateDoc(doc(db, "users", user.email), {
      points: increment(2),
    });
  };

  return (
    <div
      className={`group w-full flex flex-col mt-1 select-none  ${
        userSentMessage ? "items-end" : "items-start"
      }`}
    >
      {/* Message content, reply button, delete button, replied message and likes*/}
      <div
        className={`flex items-center ${
          userSentMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Message content */}
        <p className={messageStyle} onDoubleClick={likeMessage}>
          {message.data().replied ? (
            <p className="text-xs font-semibold">
              Replied to: {message.data().replied}
            </p>
          ) : null}
          {message.data().content}
        </p>

        {message.data().reactions?.length != 0 ? (
          <p className="bg-gray-100 rounded-xl p-2 text-xs mx-2">
            ❤ {message.data().reactions?.length}
          </p>
        ) : null}

        {/* Reply button and delete button */}
        <IconButton
          className={`h-8 w-8 mx-1 ${
            userSentMessage
              ? "bg-rose-500 text-white"
              : "bg-gray-100 text-black"
          } scale-0 group-hover:scale-100 `}
          Icon={ArrowUturnLeftIcon}
          onClick={() => {
            replytoMessage(message.data().content);
          }}
        />
        {userSentMessage ? (
          <IconButton
            className={`text-rose-500 mx-1 hover:bg-rose-50
          scale-0 group-hover:scale-100 `}
            Icon={TrashIcon}
            onClick={deleteMessage}
          />
        ) : null}
      </div>

      {/* Time and photo */}
      {styleOfMessage === "last" || styleOfMessage === "independent" ? (
        <div
          className={`flex items-center ${
            userSentMessage ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {/* Time */}
          <p className="text-xs opacity-75 mt-1">
            Sent {sentTimeAgo(message.data().sent)} ago
          </p>
          {/* Photo */}
          <Avatar src={customUser?.photoURL} className="h-4 w-4 mt-1 mx-1" />
        </div>
      ) : null}
    </div>
  );
}

export default Message;
