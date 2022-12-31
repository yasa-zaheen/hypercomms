import React from "react";
import { useRouter } from "next/router";

import Avatar from "./Avatar";

import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

function RoomCard({ room, user }) {
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

  if (contact)
    return (
      <div>
        <div
          onClick={() => {
            router.push(`/?roomId=${room.id}`);
          }}
          className="flex p-4 items-center rounded-xl bg-gray-50 cursor-pointer hover:scale-105 hover:bg-green-100 hover:shadow-lg hover:shadow-gray-200 active:brightness-75 duration-75 ease-in-out"
        >
          <Avatar src={contact.data().photoURL} />
          <div className="flex flex-col flex-1 items-start ml-4">
            <p className="text-sm">{contact.data().displayName}</p>
            <p className="text-xs opacity-50">Last sent message</p>
          </div>
          <p className="text-xs opacity-50">5m</p>
        </div>
      </div>
    );
}

export default RoomCard;
