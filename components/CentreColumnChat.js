import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import Avatar from "./Avatar";
import Message from "./Message";
import IconButton from "./IconButton";

import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  increment,
  limit,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  useCollection,
  useDocument,
  useDocumentData,
} from "react-firebase-hooks/firestore";

import {
  BellAlertIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  Squares2X2Icon,
  TrashIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function CentreColumnChat({ user, setViewRight, setViewLeft }) {
  const router = useRouter();
  const scroller = useRef();
  const textInputElement = useRef();

  const [customUser] = useDocumentData(doc(db, "users", user.email));

  // Fetching room information
  const [room] = useDocument(doc(db, "rooms", router.query.roomId));

  const displayName = room?.data()?.groupChatName
    ? room?.data()?.groupChatName
    : room?.data()?.userInfo[0].email === user.email
    ? room?.data()?.userInfo[1].displayName
    : room?.data()?.userInfo[0].displayName;

  const email =
    room?.data()?.userInfo[0].email === user.email
      ? room?.data()?.userInfo[1].email
      : room?.data()?.userInfo[0].email;

  const displayPicture =
    room?.data()?.userInfo[0].email === user.email
      ? room?.data()?.userInfo[1].photoURL
      : room?.data()?.userInfo[0].photoURL;

  // Fetching the messsages
  const [messages] = useCollection(
    query(
      collection(db, `rooms/${router.query.roomId}/messages`),
      orderBy("sent", "desc"),
      limit(25)
    )
  );

  // Determining the style of the message
  const getMessageStyle = (message) => {
    let userSentMessage;
    let styleOfMessage;

    // Determining who sent the message

    if (message.data().sender === user.email) {
      userSentMessage = true;
    }
    if (message.data().sender !== user.email) {
      userSentMessage = false;
    }

    // Determing the style of message
    let indexOfMessage = 0;

    for (let i = 0; i < messages.docs.length; i++) {
      if (messages.docs[i].id == message.id) {
        break;
      } else indexOfMessage++;
    }

    if (
      message.data().sender !== messages.docs[indexOfMessage - 1]?.data().sender
    ) {
      styleOfMessage = "last";
    }

    if (
      message.data().sender ===
        messages.docs[indexOfMessage - 1]?.data().sender &&
      message.data().sender === messages.docs[indexOfMessage + 1]?.data().sender
    ) {
      styleOfMessage = "middle";
    }

    if (
      message.data().sender !== messages.docs[indexOfMessage + 1]?.data().sender
    ) {
      styleOfMessage = "first";
    }

    if (
      message.data().sender !==
        messages.docs[indexOfMessage + 1]?.data().sender &&
      message.data().sender !== messages.docs[indexOfMessage - 1]?.data().sender
    ) {
      styleOfMessage = "independent";
    }

    return {
      userSentMessage: userSentMessage,
      styleOfMessage: styleOfMessage,
    };
  };

  //   Handling user inputs
  const [text, setText] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();

    const sentTime = serverTimestamp();
    const inputText = text;
    const repliedText = repliedMessage;
    const repliedTextSender = repliedMessageSender;
    setText("");
    setRepliedMessage("");
    setRepliedMessageSender();

    if (file) {
      const storageRef = ref(storage, `${user.email}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          fileProgressIndicator.current.style.width = `${progress}%`;
          fileProgressIndicator.current.style.height = `0.25rem`;
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const messageRef = await addDoc(
              collection(db, `rooms/${room.id}/messages`),
              {
                content: downloadURL,
                sent: sentTime,
                sender: user.email,
                senderName: user.displayName,
                room: room.id,
                replied: repliedText || null,
                repliedMessageSender: repliedTextSender || null,
                reactions: [],
              }
            );
          });

          exitFilePreviewer();
          fileProgressIndicator.current.style.width = `0%`;
          fileProgressIndicator.current.style.height = `0`;
        }
      );
    } else if (text !== "") {
      const messageRef = await addDoc(
        collection(db, `rooms/${room.id}/messages`),
        {
          content: inputText,
          sent: sentTime,
          sender: user.email,
          senderName: user.displayName,
          room: room.id,
          replied: repliedText || null,
          repliedMessageSender: repliedTextSender || null,
          reactions: [],
        }
      );
    }

    const userRef = doc(db, "users", user.email);

    // Points for replied message
    if (file) {
      await updateDoc(userRef, {
        points: increment(15),
      });
    } else if (repliedMessage) {
      await updateDoc(userRef, {
        points: increment(7),
      });
    } else {
      await updateDoc(userRef, {
        points: increment(5),
      });
    }

    // Updating the last message
    const roomRef = doc(db, "rooms", router.query.roomId);
    await updateDoc(roomRef, {
      lastSentMessage: {
        content: inputText,
        sent: sentTime,
        sender: user.displayName,
      },
      typing: arrayRemove(user.displayName),
    });

    scroller.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handling replied messages
  const [repliedMessage, setRepliedMessage] = useState();
  const [repliedMessageSender, setRepliedMessageSender] = useState();

  useEffect(() => {
    textInputElement.current.focus();
  }, [repliedMessage]);

  // Deleting rooms
  const deleteRoom = async () => {
    router.push("/");
    await deleteDoc(doc(db, "rooms", router.query.roomId));
  };

  // Handling typing indicators
  const handleTypingIndicator = async (e) => {
    if (e.target.value !== "") {
      await updateDoc(doc(db, "rooms", router.query.roomId), {
        typing: arrayUnion(user.displayName),
      });
    }

    if (e.target.value === "") {
      await updateDoc(doc(db, "rooms", router.query.roomId), {
        typing: arrayRemove(user.displayName),
      });
    }
  };

  // Handling media uploads
  const [file, setFile] = useState();
  const [uploadedImgSrc, setUploadedImgSrc] = useState();
  const [uploadedFileName, setUploadedFileName] = useState();

  const filePreviewerContainer = useRef();
  const uploadedImg = useRef();
  const fileProgressIndicator = useRef();

  const fileUploadHandler = (e) => {
    e.preventDefault();
    const reader = new FileReader();

    if (e.target.files[0]) {
      setFile(e.target.files[0]);

      reader.onload = (function () {
        if (e.target.files[0].type === "image/jpeg") {
          return function (e) {
            setUploadedImgSrc(e.target.result);
          };
        } else {
          return function () {
            setUploadedFileName(e.target.files[0].name);
          };
        }
      })();
      reader.readAsDataURL(e.target.files[0]);
    }

    filePreviewerContainer.current.classList.add("h-52");
    filePreviewerContainer.current.classList.add("mb-4");
  };

  const exitFilePreviewer = () => {
    filePreviewerContainer.current.classList.remove("h-52");
    filePreviewerContainer.current.classList.remove("mb-4");

    setFile(null);
    setUploadedFileName(null);
    setUploadedImgSrc(null);
  };

  return (
    <div className="w-full md:w-1/2 dark:text-white flex flex-col overflow-scroll relative scrollbar-hide md:py-0 h-full">
      {/* Topbar */}
      <div className="backdrop-blur-md backdrop-brightness-150 shadow-md rounded-xl p-4 flex items-center absolute w-full z-10">
        <Avatar src={displayPicture} />
        <div className="flex flex-col ml-2 justify-around">
          <p className="text-sm">{displayName}</p>
          {!room?.data()?.groupChatName ? (
            <p className="text-xs opacity-50">{email}</p>
          ) : null}
        </div>
        <div className="flex-1"></div>
        {!room?.data()?.groupChatName ? (
          <IconButton
            Icon={TrashIcon}
            onClick={deleteRoom}
            className={
              "bg-red-50 text-rose-900 dark:bg-[#fb71855f] dark:text-red-50"
            }
          />
        ) : null}
        <IconButton
          Icon={Squares2X2Icon}
          onClick={() => {
            router.push("/");
          }}
          className={
            "bg-blue-50 text-blue-900 dark:bg-[#60a5fa5f] dark:text-blue-50 md:hidden"
          }
        />
        <IconButton
          Icon={TrophyIcon}
          onClick={() => {
            setViewRight(true);
          }}
          className={
            "bg-fuchsia-50 text-fuchsia-900 dark:bg-[#e879f95f] dark:text-fuchsia-50 mx-2 md:hidden"
          }
        />
        <IconButton
          Icon={BellAlertIcon}
          onClick={() => {
            setViewLeft(true);
          }}
          className={
            "bg-rose-50 text-rose-900 dark:bg-[#fb71855f] dark:text-rose-50 md:hidden"
          }
        />
      </div>

      {/* Chats */}
      <div className="flex-1 flex flex-col-reverse my-4 px-2 md:px-0 overflow-y-scroll rounded-xl scrollbar-hide">
        {room?.data()?.typing?.length === 1 &&
        room?.data()?.typing[0] !== user.displayName ? (
          <p className="text-sm opacity-75">
            {room?.data().typing[0]} is typing ...{" "}
          </p>
        ) : null}
        {room?.data()?.typing?.length > 1 ? (
          <p className="text-sm opacity-75">Several people are typing ...</p>
        ) : null}
        <div ref={scroller} className="h-4 bg-transparent"></div>
        {messages?.docs.map((message) => (
          <Message
            message={message}
            style={getMessageStyle(message)}
            repliedMessage={repliedMessage}
            setRepliedMessage={setRepliedMessage}
            setRepliedMessageSender={setRepliedMessageSender}
            user={user}
          />
        ))}
      </div>

      {/* Input */}
      <form
        className="bg-gray-50 text-black dark:bg-zinc-800 dark:text-white rounded-xl p-4 flex flex-col"
        onSubmit={sendMessage}
      >
        {/* Replied message container */}
        <div
          className={`flex items-center space-x-4 ${
            repliedMessage ? "opacity-100 mb-4" : "h-0 opacity-0"
          } duration-200 ease-in-out`}
        >
          <IconButton
            Icon={XMarkIcon}
            className={`${customUser?.theme}`}
            onClick={() => {
              setRepliedMessage();
            }}
          />
          <div>
            <p className="text-sm font-semibold">
              Replying to {repliedMessageSender}
            </p>
            <p className="text-xs opacity-75">{repliedMessage}</p>
          </div>
        </div>

        {/* File preview container */}

        <div
          ref={filePreviewerContainer}
          className="w-full overflow-hidden flex items-center justify-start bg-inherit relative rounded-lg duration-200 ease-in-out"
        >
          {uploadedImgSrc ? (
            <img
              ref={uploadedImg}
              src={uploadedImgSrc}
              className="h-full rounded-lg"
            />
          ) : uploadedFileName ? (
            <p className="bg-red-500 px-4 py-2 m-0">{uploadedFileName}</p>
          ) : null}
          <IconButton
            onClick={exitFilePreviewer}
            Icon={XMarkIcon}
            className="absolute top-0 right-0 bg-green-200 dark:bg-[#fb71855f] dark:text-rose-50"
          />
          <span
            ref={fileProgressIndicator}
            className="h-0 w-0 bg-green-200 dark:bg-[#fb71855f] absolute bottom-0 duration-200 ease-linear rounded-lg"
          ></span>
        </div>

        {/* Input container */}
        <div className="flex items-center space-x-4">
          {/* Media upload button */}
          <input
            type="file"
            id="actual-btn"
            onChange={fileUploadHandler}
            hidden
          />
          <label
            htmlFor="actual-btn"
            className={`h-10 w-10 cursor-pointer rounded-full flex items-center justify-center p-3 active:brightness-90 duration-75 ease-in-out ${customUser?.theme}`}
          >
            <PlusCircleIcon className="h-6 w-6" />
          </label>

          {/* Input element */}
          <div
            className={`w-full flex items-center mt-0 rounded-xl bg-white dark:bg-zinc-700 p-3 text-lg md:text-sm`}
          >
            <input
              ref={textInputElement}
              autoFocus
              className="bg-inherit rounded-md w-full outline-none"
              placeholder={"Don't be shy, Say hi!"}
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                handleTypingIndicator(e);
              }}
            />
          </div>

          {/* Send button */}
          <IconButton
            Icon={PaperAirplaneIcon}
            className={`${customUser?.theme}`}
            submit
          />
        </div>
      </form>
    </div>
  );
}

export default CentreColumnChat;
