import { useState } from "react";

import TextButton from "./TextButton";
import IconButton from "./IconButton";

import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  query,
  collection,
  where,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import CustomInput from "./CustomInput";
import Avatar from "./Avatar";
import RoomCard from "./RoomCard";

function ContactsPanel({ user }) {
  const [searchInput, setSearchInput] = useState("");

  const [customUser, customUserLoading] = useDocument(
    doc(db, "users", user.email)
  );

  const [rooms] = useCollection(
    query(collection(db, "rooms"), where("users", "array-contains", user.email))
  );

  const startConversation = async (e) => {
    e.preventDefault();

    const docRef = doc(db, "users", searchInput);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await addDoc(collection(db, "rooms"), {
        users: [customUser.data().email, docSnap.data().email],
        userInfo: [customUser.data(), docSnap.data()],
      });
    } else {
      console.log("No such document!");
    }

    // await addDoc(collection(db, "rooms"), {
    //   users: [user.email, searchInput],
    // });
    setSearchInput("");
  };

  return (
    <div className="w-1/4 rounded-xl">
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
      {/* Search Panel */}
      <form onSubmit={startConversation}>
        <CustomInput
          Icon={MagnifyingGlassIcon}
          placeholder={"Search"}
          value={searchInput}
          setValue={setSearchInput}
          className="mt-4 rounded-md rounded-b-none"
        />

        <TextButton
          text="Start conversation"
          className={"text-sm w-full rounded-t-none bg-pink-500"}
          onClick={startConversation}
          submit
        />
      </form>
      {/* Contacts Panel */}
      <div className="mt-4">
        {rooms?.docs.map((room) => (
          <RoomCard user={user} room={room} />
        ))}
      </div>
    </div>
  );
}

export default ContactsPanel;
