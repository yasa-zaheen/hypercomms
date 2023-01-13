import React, { useState } from "react";
import { useRouter } from "next/router";

import Avatar from "./Avatar";
import IconButton from "./IconButton";
import TextButton from "./TextButton";
import CustomInput from "./CustomInput";

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

import {
  BellAlertIcon,
  TrophyIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function CentreColumnDashboard({ user, setViewRight, setViewLeft }) {
  const router = useRouter();
  const [viewGroupChatPanel, setViewGroupChatPanel] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");

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
      if (
        room.data().users.includes(email) &&
        room.data().users.includes(user.email) &&
        !room.data().groupChatName
      ) {
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

  // Handling group chats
  const clickCheckBox = (e) => {
    if (e.target.childNodes[0].checked == false) {
      e.target.childNodes[0].checked = true;
    } else {
      e.target.childNodes[0].checked = false;
    }
  };

  const startGroupChat = async (e) => {
    e.preventDefault();

    const emails = [customUser.data().email];

    // Getting data from checkboxes
    const checkBoxes = document.querySelectorAll("input[type='checkbox']");
    checkBoxes.forEach((checkbox) => {
      if (checkbox.checked) {
        emails.push(checkbox.value);
      }
    });

    const usersInfo = [customUser.data()];

    // Getting user information
    users.forEach((user) => {
      if (emails.includes(user.email)) {
        usersInfo.push(user);
      }
    });

    // Starting the group chat

    const docRef = await addDoc(collection(db, "rooms"), {
      users: emails,
      userInfo: usersInfo,
      groupChatName: groupChatName,
      lastSentMessage: {
        content: "Just started a conversation",
        sent: serverTimestamp(),
        sender: user.displayName,
      },
    });

    router.push(`/?roomId=${docRef.id}`);
    // }
  };

  return (
    <div className="w-full h-full dark:bg-black dark:text-white rounded-xl flex flex-col overflow-scroll scrollbar-hide p-4 md:p-0 md:w-1/2 ">
      {/* News and updates */}

      <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
        <div className="w-full p-4 rounded-xl bg-gradient-to-tr from-[#d3f3f1] to-[#b5c6e0] dark:from-[#103783] dark:to-[#9bafd9] md:w-1/2">
          <p className="text-2xl font-semibold">What's new</p>
          <p className="text-sm opacity-75">
            Well basically everything! Welcome to Eden(codename: hypercomms 😉).
            Try out the app and let me know how it works out!
          </p>
        </div>
        <div className="w-full p-4 rounded-xl bg-gradient-to-tr from-[#e1dae6] to-[#f6c4ed] dark:from-[#0b3866] dark:to-[#95f9c3] md:w-1/2">
          <p className="text-2xl font-semibold">Upcoming</p>
          <p className="text-sm opacity-75">
            - Landing page
            <br />
            - Dark mode
            <br />- Typing indicators
          </p>
        </div>
      </div>
      {/* New users */}
      <div>
        <p className="text-2xl font-semibold mt-4">
          Let's welcome our new users!
        </p>
        <p className="text-sm opacity-75 mb-4">
          Click on their cards to start chatting with them!
        </p>
        <div className="grid grid-flow-row grid-cols-1 gap-x-2 gap-y-2 mt-2 md:grid-cols-3">
          {/* Group chat button */}
          <div
            className="bg-cyan-50 text-cyan-900 dark:bg-[#2dd4bf5f] dark:text-cyan-50 p-4 rounded-xl flex items-center space-x-4 cursor-pointer active:brightness-75 duration-75 ease-in-out"
            onClick={() => {
              setViewGroupChatPanel(true);
            }}
          >
            <IconButton
              Icon={UserGroupIcon}
              className={"bg-cyan-100 dark:bg-[#2dd4bf5f]"}
            />
            <div className="flex flex-col">
              <p className="font-semibold">Group Chat</p>
              <p className="text-xs opacity-75">Start a group chat!</p>
            </div>
          </div>
          {/* Conversations button */}
          <div
            className="bg-fuchsia-50 text-fuchsia-900 dark:bg-[#e879f95f] dark:text-fuchsia-50 p-4 rounded-xl flex items-center space-x-4 cursor-pointer active:brightness-75 duration-75 ease-in-out md:hidden"
            onClick={() => {
              setViewLeft(true);
            }}
          >
            <IconButton
              Icon={BellAlertIcon}
              className={"bg-fuchsia-200 dark:bg-[#e879f95f]"}
            />
            <div className="flex flex-col">
              <p className="font-semibold">Conversations</p>
              <p className="text-xs opacity-75">
                Click here to view your conversations
              </p>
            </div>
          </div>
          {/* Leaderboards button */}
          <div
            className="bg-rose-50 text-rose-900 dark:bg-[#fb71855f] dark:text-rose-50 p-4 rounded-xl flex items-center space-x-4 cursor-pointer active:brightness-75 duration-75 ease-in-out md:hidden"
            onClick={() => {
              setViewRight(true);
            }}
          >
            <IconButton
              Icon={TrophyIcon}
              className={"bg-rose-100 dark:bg-[#fb71855f]"}
            />
            <div className="flex flex-col">
              <p className="font-semibold">Leaderboard</p>
              <p className="text-xs opacity-75">
                Click here to view the Leaderboard
              </p>
            </div>
          </div>
          {users?.map((user) => (
            <div
              className="bg-gray-50 dark:bg-zinc-800 flex space-x-4 items-center p-4 rounded-xl cursor-pointer hover:bg-purple-50 dark:hover:bg-[#c084fc5f] dark:hover:text-purple-50 dark:hover:border-purple-50 hover:shadow-md active:brightness-75 duration-75 ease-in-out"
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

      {/* Group chat interface */}
      {viewGroupChatPanel ? (
        <div className="h-screen w-full flex items-center justify-center absolute backdrop-brightness-50 top-0 left-0 z-50">
          <form
            id="groupChatForm"
            className="p-4 bg-white dark:bg-black h-3/4 w-3/4 overflow-scroll scrollbar-hide rounded-xl"
            onSubmit={startGroupChat}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold mb-4">
                Add users to your group chat
              </p>
              <IconButton
                Icon={XMarkIcon}
                className="bg-red-50 dark:bg-red-800 text-red-500 dark:text-white"
                onClick={() => {
                  setViewGroupChatPanel(false);
                }}
              />
            </div>
            <CustomInput
              value={groupChatName}
              setValue={setGroupChatName}
              placeholder="Give a name for the group chat"
              className={"bg-gray-100 dark:bg-zinc-800 rounded-xl mb-4 mt-4"}
              Icon={UserGroupIcon}
            />
            <div className="grid grid-flow-row grid-cols-1 gap-x-4 gap-y-4 select-none md:grid-cols-3">
              {users?.map((user) => (
                <div
                  className="bg-gray-50 dark:bg-zinc-800 flex space-x-4 items-center p-4 rounded-xl cursor-pointer"
                  onClick={clickCheckBox}
                >
                  <input
                    type="checkbox"
                    name={user.email}
                    id=""
                    value={user.email}
                    className="pointer-events-none"
                  />
                  <Avatar src={user.photoURL} className="pointer-events-none" />
                  <p className="text-sm font-medium pointer-events-none">
                    {user.displayName}
                  </p>
                </div>
              ))}
            </div>
            <TextButton
              text="Start group chat"
              className={
                "bg-sky-50 text-sky-500 dark:bg-sky-900 dark:text-white w-full mt-4"
              }
              submit
            />
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default CentreColumnDashboard;
