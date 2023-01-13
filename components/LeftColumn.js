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
import { useEffect, useRef } from "react";

function LeftColumn({ user, viewLeft, setViewLeft }) {
  const router = useRouter();
  const [rooms] = useCollection(
    query(collection(db, "rooms"), where("users", "array-contains", user.email))
  );

  const container = useRef();

  useEffect(() => {
    viewLeft
      ? container.current.classList.remove("-translate-x-full")
      : container.current.classList.add("-translate-x-full");
  }, [viewLeft]);

  return (
    <div
      ref={container}
      className="-translate-x-full overflow-scroll scrollbar-hide w-full h-screen absolute bg-white dark:bg-black z-50 flex flex-col rounded-xl p-4 md:p-0 md:w-1/4 md:relative md:h-auto md:translate-x-0 duration-200 ease-in-out"
    >
      {/* Control Panel */}
      <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 flex items-center justify-between">
        <Avatar src={user?.photoURL} />
        <IconButton
          Icon={ArrowRightOnRectangleIcon}
          className={"bg-gray-200 dark:bg-zinc-700 dark:text-white"}
          onClick={() => {
            signOut(auth);
          }}
        />
      </div>

      {/* Home button */}
      <div
        className="my-2 bg-rose-50 text-rose-900 dark:bg-[#fb71855f] dark:text-rose-50 p-4 rounded-xl hidden items-center space-x-4 cursor-pointer hover:shadow-md active:brightness-75 duration-200 ease-in-out md:flex"
        onClick={() => {
          router.push("/");
        }}
      >
        <IconButton
          Icon={Squares2X2Icon}
          className={"bg-red-100 dark:bg-[#fb71855f]"}
        />
        <div className="flex flex-col">
          <p className="font-semibold">Dashboard</p>
          <p className="text-xs opacity-75">Go back to the Dashboard</p>
        </div>
      </div>
      <div
        className="my-2 bg-rose-50 text-rose-900 dark:bg-rose-900 dark:text-white p-4 rounded-xl flex items-center space-x-4 cursor-pointer active:brightness-75 duration-200 ease-in-out md:hidden"
        onClick={() => {
          setViewLeft(false);
        }}
      >
        <IconButton
          Icon={Squares2X2Icon}
          className={"bg-red-200 dark:bg-rose-800"}
        />
        <div className="flex flex-col">
          <p className="font-semibold">Dashboard</p>
          <p className="text-xs opacity-75">Go back to the Dashboard</p>
        </div>
      </div>

      {/* Contacts Panel */}
      <div className="rounded-xl flex-1">
        {rooms?.docs.map((room) => (
          <RoomCard setViewLeft={setViewLeft} user={user} room={room} />
        ))}
      </div>
    </div>
  );
}

export default LeftColumn;
