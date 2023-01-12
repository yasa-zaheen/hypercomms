import React, { useState, useEffect, useRef } from "react";

import { db } from "../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import Avatar from "./Avatar";
import IconButton from "./IconButton";

import { Squares2X2Icon } from "@heroicons/react/24/outline";

function RightColumn({ viewRight, setViewRight }) {
  const [users] = useCollectionData(
    query(collection(db, "users"), orderBy("points", "desc"))
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
      className="-translate-x-full bg-white dark:bg-black dark:text-white w-full absolute p-4 flex flex-col space-y-4 rounded-xl md:w-1/4 md:p-0 md:relative md:translate-x-0 duration-200 ease-in-out"
    >
      <div className=" bg-orange-50 dark:bg-zinc-800 flex-1 overflow-scroll scrollbar-hide rounded-xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-2xl font-semibold">Leaderboard</p>
          <IconButton
            Icon={Squares2X2Icon}
            onClick={() => {
              setViewRight(false);
            }}
            className={"bg-orange-200 dark:bg-zinc-700 md:hidden"}
          />
        </div>
        {users?.map((user) => (
          <div className="flex items-center mb-4">
            <Avatar src={user.photoURL} />
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium">{user.displayName}</p>
              <p className="text-xs opacity-50">{user.email}</p>
            </div>
            <p className="text-md font-semibold">{user.points} pts</p>
          </div>
        ))}
      </div>
      <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-xl flex justify-center">
        <p className="font-semibold">Made by Yasa Zaheen.</p>
      </div>
    </div>
  );
}

export default RightColumn;
