import React from "react";
import Image from "next/image";

function Avatar({ src }) {
  return (
    <div className="h-10 w-10 rounded-full bg-neutral-200 relative block overflow-hidden">
      <Image src={src} fill className="object-cover" />
    </div>
  );
}

export default Avatar;
