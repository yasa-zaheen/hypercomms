import React from "react";

function Embed({ src, messageStyle }) {
  if (src.includes("firebasestorage.googleapis.com")) {
    return (
      <div
        className={`${messageStyle} h-fit w-fit md:w-1/2 px-0 py-0 overflow-hidden flex items-center justify-center relative`}
      >
        <embed className="h-full w-full object-fill" src={src} />
      </div>
    );
  } else if (src.includes("open.spotify.com")) {
    let uri = `https://open.spotify.com/embed/track/${
      src.split("?")[0].split("/")[4]
    }`;
    return (
      <div
        className={`${messageStyle} w-72 h-20 px-0 py-0 overflow-hidden flex items-center justify-center relative`}
      >
        <iframe
          className="h-full w-full"
          src={uri}
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
      </div>
    );
  } else if (src.includes("youtube.com/watch?v")) {
    let uri = `https://www.youtube.com/embed/${
      src.split(" ")[0].split("=")[1]
    }`;
    return (
      <div
        className={`${messageStyle} h-full w-full px-0 py-0 overflow-hidden flex items-center justify-center relative`}
      >
        <iframe
          src={uri}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  } else if (src.includes("youtu.be")) {
    let uri = `https://www.youtube.com/embed/${src.split("/")[3]}`;
    return (
      <div
        className={`${messageStyle} h-full w-full px-0 py-0 overflow-hidden flex items-center justify-center relative`}
      >
        <iframe
          src={uri}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  } else {
    return (
      <div className={`${messageStyle} underline`}>
        <a href={src}>{src}</a>
      </div>
    );
  }
}

export default Embed;
