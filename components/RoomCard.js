import React from "react";
import { useRouter } from "next/router";

import Avatar from "./Avatar";
import sentTimeAgo from "../functions/sentTimeAgo";

import { db } from "../firebase";
import { collection, doc, limit, orderBy, query } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

function RoomCard({ room, user, setViewLeft }) {
  const router = useRouter();

  const [contact] = useDocument(
    doc(
      db,
      "users",
      room.data().users.filter((value) => {
        return value != user.email;
      })[0]
    )
  );

  const displayName = room.data().groupChatName || contact?.data().displayName;

  if (contact)
    return (
      <div>
        <div
          onClick={() => {
            router.push(`/?roomId=${room.id}`);
            setViewLeft(false);
          }}
          className="flex p-4 items-center rounded-xl bg-gray-50 cursor-pointer hover:scale-105 hover:bg-green-100 hover:shadow-lg hover:shadow-gray-200 active:brightness-75 duration-75 ease-in-out"
        >
          <Avatar src={contact.data().photoURL} />
          <div className="flex flex-col flex-1 items-start ml-4">
            <p className="text-sm">{displayName}</p>
            <p className="text-xs opacity-50">
              {room.data().lastSentMessage.sender}:{" "}
              {room.data().lastSentMessage.content}
            </p>
          </div>
          <p className="text-xs opacity-50">
            {sentTimeAgo(room.data().lastSentMessage.sent)}
          </p>
        </div>
      </div>
    );
}

export default RoomCard;
