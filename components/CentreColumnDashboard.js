import React from "react";
import { useRouter } from "next/router";

import Avatar from "./Avatar";

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  useCollectionDataOnce,
  useCollectionOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";

function CentreColumnDashboard({ user }) {
  const router = useRouter();
  const [customUser] = useDocumentOnce(doc(db, "users", user.email));

  const [users] = useCollectionDataOnce(
    query(collection(db, "users"), where("email", "!=", user.email))
  );
  const [rooms] = useCollectionOnce(
    query(collection(db, "rooms")),
    where("users", "array-contains", user.email)
  );

  // Start a conversation with a user
  const startConversation = async (email) => {
    let conversationExists = false;

    // Check if there is existing conversation
    rooms.forEach((room) => {
      if (room.data().users.includes(email)) {
        conversationExists = true;
        router.push(`/?roomId=${room.id}`);
      }
    });

    // Else create a conversation
    if (!conversationExists) {
      const contactRef = doc(db, "users", email);
      const contactSnap = await getDoc(contactRef);

      if (contactSnap.exists()) {
        const docRef = await addDoc(collection(db, "rooms"), {
          users: [customUser.data().email, contactSnap.data().email],
          userInfo: [customUser.data(), contactSnap.data()],
          lastSentMessage: {
            content: "Just started a conversation",
            sent: serverTimestamp(),
            sender: user.displayName,
          },
        });

        router.push(`/?roomId=${docRef.id}`);
      }
    }
  };

  return (
    <div className="w-1/2 flex flex-col space-y-4 h-full">
      {/* News and updates */}
      <div className="flex space-x-4">
        <div className="w-1/2 p-4 rounded-xl bg-gradient-to-tr from-[#d3f3f1] to-[#b5c6e0]">
          <p className="text-2xl font-semibold">What's new</p>
          <p className="text-sm opacity-75">
            Well basically everything! Welcome to Eden(codename: hypercomms 😉).
            Try out the app and let me know how it works out!
          </p>
        </div>
        <div className="w-1/2 p-4 rounded-xl bg-gradient-to-tr from-[#e1dae6] to-[#f6c4ed]">
          <p className="text-2xl font-semibold">Upcoming</p>
          <p className="text-sm opacity-75">
            - Dark mode
            <br />
            - Group chats
            <br />- Twitter emojis
          </p>
        </div>
      </div>
      {/* New users */}
      <div>
        <p className="text-2xl font-semibold">Let's welcome our new users!</p>
        <p className="text-sm opacity-75">
          Click on their cards to start chatting with them!
        </p>
        <div className="grid grid-flow-col grid-cols-3 space-x-4 mt-4">
          {users?.map((user) => (
            <div
              className="bg-gray-50 flex space-x-4 items-center p-4 rounded-xl cursor-pointer hover:scale-105 hover:bg-purple-100 hover:shadow-lg hover:shadow-gray-200 active:brightness-75 duration-75 ease-in-out"
              onClick={() => {
                startConversation(user.email);
              }}
            >
              <Avatar src={user.photoURL} />
              <p className="text-sm font-medium">{user.displayName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CentreColumnDashboard;
