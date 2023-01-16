import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Avatar from "../components/Avatar";
import CustomInput from "../components/CustomInput";
import TextButton from "../components/TextButton";

import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "../components/IconButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { doc, updateDoc } from "firebase/firestore";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";

function Settings() {
  const router = useRouter();

  const [user] = useAuthState(auth);
  const [customUser] = useDocumentData(doc(db, "users", user.email));

  const [displayName, setDisplayName] = useState(user?.displayName);

  const updateUser = async (e) => {
    e.preventDefault();

    let customTheme = customUser.theme;
    let radios = document.getElementsByName("theme");
    radios.forEach((radio) => {
      if (radio.checked) {
        switch (radio.value) {
          case "red":
            customTheme =
              "bg-rose-50 text-rose-900 dark:bg-[#fb71855f] dark:text-rose-50";
            break;
          case "pink":
            customTheme =
              "bg-pink-50 text-pink-900 dark:bg-[#f472b65f] dark:text-pink-50";
            break;
          case "blue":
            customTheme =
              "bg-blue-50 text-blue-900 dark:bg-[#60a5fa5f] dark:text-blue-50";
            break;
          case "green":
            customTheme =
              "bg-emerald-50 text-emerald-900 dark:bg-[#34d3995f] dark:text-emerald-50";
            break;
          case "yellow":
            customTheme =
              "bg-yellow-50 text-yellow-900 dark:bg-[#facc155f] dark:text-yellow-50";
            break;
          default:
            customTheme = customUser.theme;
        }
      }
    });

    updateProfile(user, {
      displayName: displayName,
    })
      .then(async () => {
        await updateDoc(doc(db, "users", user.email), {
          displayName: displayName,
          theme: customTheme,
        });
        console.log("User Updated");
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap"
          rel="stylesheet"
        ></link>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7299531318569051"
          crossorigin="anonymous"
        ></script>
      </Head>
      <main className="min-h-screen min-w-full bg-white text-black dark:bg-black dark:text-white flex items-center justify-center">
        <form
          onSubmit={updateUser}
          className="bg-zinc-800 w-1/2 rounded-xl p-4"
        >
          <div className="flex items-center space-x-4 mb-4">
            <IconButton
              Icon={ArrowLeftIcon}
              className="dark:bg-[#a78bfa5f] dark:text-indigo-50"
              onClick={() => {
                router.push("/");
              }}
            />
            <p className="text-2xl font-semibold">Settings</p>
          </div>
          <p className="text-lg font-semibold mb-2">Display name</p>
          <div className="flex items-center space-x-4 mb-4">
            {/* Change pfp */}
            <Avatar src={user?.photoURL} className="h-16 w-16" />

            {/* Change displayName */}
            <CustomInput
              placeholder={"Enter your display name"}
              value={displayName}
              setValue={setDisplayName}
              className="bg-zinc-900 rounded-xl flex-1"
            />
          </div>
          {/* Change theme */}
          <p className="text-lg font-semibold mb-2">Theme</p>
          <div className="flex space-x-2 mb-4">
            <div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
              <input
                className="p-0 m-0"
                type="radio"
                name="theme"
                value="red"
                id=""
              />
            </div>
            <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
              <input
                className="p-0 m-0"
                type="radio"
                name="theme"
                value="blue"
                id=""
              />
            </div>
            <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
              <input
                className="p-0 m-0"
                type="radio"
                name="theme"
                value="green"
                id=""
              />
            </div>
            <div className="h-5 w-5 bg-yellow-500 rounded-full flex items-center justify-center">
              <input
                className="p-0 m-0"
                type="radio"
                name="theme"
                value="yellow"
                id=""
              />
            </div>
            <div className="h-5 w-5 bg-pink-500 rounded-full flex items-center justify-center">
              <input
                className="p-0 m-0"
                type="radio"
                name="theme"
                value="pink"
                id=""
              />
            </div>
          </div>
          {/* Submit button */}
          <TextButton
            text={"Save changes"}
            className="w-full dark:bg-[#2563eb] dark:text-blue-50 active:brightness-95"
            submit
          />
        </form>
      </main>
    </>
  );
}

export default Settings;
