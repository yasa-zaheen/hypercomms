import { useRouter } from "next/router";

import IconButton from "./IconButton";
import Avatar from "./Avatar";
import RoomCard from "./RoomCard";

import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { query, collection, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import {
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

function LeftColumn({ user }) {
  const router = useRouter();
  const [rooms] = useCollection(
    query(collection(db, "rooms"), where("users", "array-contains", user.email))
  );

  return (
    <div className="w-1/4 flex flex-col rounded-xl">
      {/* Control Panel */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
        <Avatar src={user?.photoURL} />
        <IconButton
          Icon={ArrowRightOnRectangleIcon}
          className={"bg-gray-200"}
          onClick={() => {
            signOut(auth);
          }}
        />
      </div>

      {/* Home button */}
      <div
        className="my-4 bg-red-50 p-4 rounded-xl flex items-center space-x-4 cursor-pointer hover:scale-105 hover:bg-red-100 hover:shadow-lg active:brightness-75 duration-75 ease-in-out"
        onClick={() => {
          router.push("/");
        }}
      >
        <IconButton Icon={Squares2X2Icon} className={"bg-red-200"} />
        <div className="flex flex-col">
          <p className="font-semibold">Dashboard</p>
          <p className="text-xs opacity-75">Go back to the Dashboard</p>
        </div>
      </div>

      {/* Contacts Panel */}
      <div className="bg-gray-50 rounded-xl flex-1">
        {rooms?.docs.map((room) => (
          <RoomCard user={user} room={room} />
        ))}
      </div>
    </div>
  );
}

export default LeftColumn;
