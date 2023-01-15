import React, { useState, useEffect, useRef } from "react";

import { db } from "../firebase";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import Avatar from "./Avatar";
import IconButton from "./IconButton";

import { Squares2X2Icon, XMarkIcon } from "@heroicons/react/24/outline";

function RightColumn({ viewRight, setViewRight }) {
  const [users] = useCollectionData(
    query(collection(db, "users"), orderBy("points", "desc"), limit(10))
  );

  const container = useRef();

  useEffect(() => {
    viewRight
      ? container.current.classList.remove("-translate-x-full")
      : container.current.classList.add("-translate-x-full");
  }, [viewRight]);

  return (
    <div
      ref={container}
      className="-translate-x-full bg-white dark:bg-black dark:text-white w-full absolute flex flex-col space-y-2 rounded-xl p-4 md:p-0 md:w-1/4 md:relative md:translate-x-0 duration-200 ease-in-out z-40"
    >
      <div className=" bg-orange-50 text-orange-900 dark:bg-zinc-800 dark:text-white flex-1 overflow-scroll scrollbar-hide rounded-xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-2xl font-semibold">Leaderboard</p>
          <IconButton
            Icon={XMarkIcon}
            onClick={() => {
              setViewRight(false);
            }}
            className={"bg-orange-100 dark:bg-zinc-700 md:hidden"}
          />
        </div>
        {users?.map((user) => (
          <div className="flex items-center mb-4">
            <Avatar src={user.photoURL} />
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium">{user.displayName}</p>
            </div>
            <p className="text-md font-semibold">{user.points} 🔥</p>
          </div>
        ))}
      </div>
      <div className="bg-purple-50 dark:bg-[#f472b65f] dark:text-fuchsia-50 p-4 rounded-xl flex justify-center">
        <p className="font-semibold">Made by Yasa Zaheen.</p>
      </div>
    </div>
  );
}

export default RightColumn;
