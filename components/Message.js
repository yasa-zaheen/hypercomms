import React from "react";

import Avatar from "./Avatar";
import IconButton from "./IconButton";

import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

function Message({ message, style, setRepliedMessage }) {
  const { userSentMessage, styleOfMessage } = style;

  const [customUser] = useDocumentData(doc(db, "users", message.sender));

  // Setting the roundness of the message
  let messageStyle = `w-full flex flex-col ${
    userSentMessage
      ? "bg-rose-500 items-end"
      : "bg-gray-100 text-black items-start"
  } w-fit px-4 py-2 text-white rounded-3xl duration-200 ease-in-out`;
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

  // Rendering the time of the message
  const renderTime = () => {
    const messageTime = message.sent?.toDate();
    const currentTime = new Date();
    const timeDelta = messageTime - currentTime;
    const timeDeltaInSeconds = Math.round((timeDelta * -1) / 1000);
    const timeDeltaInMinutes = Math.round((timeDelta * -1) / 1000 / 60);
    const timeDeltaHours = Math.round((timeDelta * -1) / 1000 / 60 / 60);

    const time =
      timeDeltaInSeconds < 60
        ? `Sent ${timeDeltaInSeconds}s ago`
        : timeDeltaInMinutes < 60
        ? `Sent ${timeDeltaInMinutes}m ago`
        : timeDeltaHours < 60
        ? `Sent ${timeDeltaHours}h ago`
        : "";

    return time;
  };

  // Handling replied messages
  const replytoMessage = (message) => {
    setRepliedMessage(message);
  };

  return (
    <div
      className={`group w-full flex flex-col mt-1  ${
        userSentMessage ? "items-end" : "items-start"
      }`}
    >
      {/* Message content, reply button and replied message */}
      <div
        className={`flex items-center ${
          userSentMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <p className={messageStyle}>
          {message.replied ? (
            <p className="text-xs font-semibold">
              Replied to: {message.replied}
            </p>
          ) : null}
          {message.content}
        </p>
        <IconButton
          className={`h-8 w-8 mx-2 ${
            userSentMessage
              ? "bg-rose-500 text-white"
              : "bg-gray-100 text-black"
          } scale-0 group-hover:scale-100 `}
          Icon={ArrowUturnLeftIcon}
          onClick={() => {
            replytoMessage(message.content);
          }}
        />
      </div>

      {/* Time and photo */}
      {styleOfMessage === "last" || styleOfMessage === "independent" ? (
        <div
          className={`flex items-center ${
            userSentMessage ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <p className="text-xs opacity-75 mt-1">{renderTime()}</p>
          <Avatar src={customUser?.photoURL} className="h-4 w-4 mt-1 mx-1" />
        </div>
      ) : null}
    </div>
  );
}

export default Message;
