import React, { useState } from "react";
import { useRouter } from "next/router";

import LeftColumn from "./LeftColumn";
import CentreColumnChat from "./CentreColumnChat";
import CentreColumnDashboard from "./CentreColumnDashboard";
import RightColumn from "./RightColumn";

function ChatArea({ user }) {
  const router = useRouter();
  const [viewLeft, setViewLeft] = useState(false);
  const [viewRight, setViewRight] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden scrollbar-hide flex dark:bg-black md:p-4">
      {/* Left column */}
      <LeftColumn viewLeft={viewLeft} setViewLeft={setViewLeft} user={user} />
      {/* Centre column */}
      {router.query.roomId ? (
        <CentreColumnChat
          setViewLeft={setViewLeft}
          setViewRight={setViewRight}
          user={user}
        />
      ) : (
        <CentreColumnDashboard
          setViewLeft={setViewLeft}
          setViewRight={setViewRight}
          user={user}
        />
      )}
      {/* Right column */}
      <RightColumn viewRight={viewRight} setViewRight={setViewRight} />
    </div>
  );
}

export default ChatArea;
