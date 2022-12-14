import React from "react";
import { useRouter } from "next/router";

import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

import Avatar from "./Avatar";

function RoomCard({ room, user }) {
  const router = useRouter();

  const [contact, contactLoading] = useDocument(
    doc(
      db,
      "users",
      room.data().users.filter((value) => {
        return value != user.email;
      })[0]
    )
  );

  if (contactLoading) return;
  if (contact)
    return (
      <div>
        <div
          onClick={() => {
            router.push(room.id);
          }}
          className="flex p-4 bg-gray-50 rounded-xl items-center cursor-pointer hover:brightness-95 duration-75 ease-in-out active:brightness-90"
        >
          <Avatar src={contact.data().photoURL} />
          <div className="flex flex-col flex-1 items-start ml-4">
            <p className="text-sm">{contact.data().displayName}</p>
            <p className="text-xs opacity-50">Hey!</p>
          </div>
          <p className="text-xs opacity-50">5m</p>
        </div>
      </div>
    );
}

export default RoomCard;
