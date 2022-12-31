import React from "react";

import Avatar from "./Avatar";

import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

function Message({ message, style }) {
  const { userSentMessage, styleOfMessage } = style;

  const [customUser] = useDocumentData(doc(db, "users", message.sender));

  // Setting the roundness of the message
  let messageStyle = `w-full ${
    userSentMessage ? "bg-rose-500" : "bg-gray-100 text-black"
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

  return (
    <div
      className={`w-full flex flex-col mt-1  ${
        userSentMessage ? "items-end" : "items-start"
      }`}
    >
      <p className={messageStyle}>{message.content}</p>
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
