import React from "react";

import { db } from "../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Avatar from "./Avatar";

function RightColumn() {
  const [users] = useCollectionData(
    query(collection(db, "users"), orderBy("points", "desc"))
  );

  return (
    <div className="w-1/4 flex flex-col space-y-4 rounded-xl bg-orange-50 p-4">
      <p className="text-2xl font-semibold">Leaderboard</p>
      {users?.map((user) => (
        <div className="flex items-center">
          <Avatar src={user.photoURL} />
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium">{user.displayName}</p>
            <p className="text-xs opacity-50">{user.email}</p>
          </div>
          <p className="text-md font-semibold">{user.points} pts</p>
        </div>
      ))}
    </div>
  );
}

export default RightColumn;
