import React from "react";
import { useRouter } from "next/router";

import LeftColumn from "./LeftColumn";
import CentreColumnChat from "./CentreColumnChat";
import CentreColumnDashboard from "./CentreColumnDashboard";
import RightColumn from "./RightColumn";

function ChatArea({ user }) {
  const router = useRouter();

  return (
    <div className="h-screen w-full overflow-hidden flex space-x-4 p-4">
      {/* Left column */}
      <LeftColumn user={user} />
      {/* Centre column */}
      {router.query.roomId ? (
        <CentreColumnChat user={user} />
      ) : (
        <CentreColumnDashboard user={user} />
      )}
      {/* Right column */}
      <RightColumn />
    </div>
  );
}

export default ChatArea;
