"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useRoom,
} from "@liveblocks/react/suspense";
const INACTIVE_TIMEOUT = 1000 * 60 * 60;
export function Room({ children, roomId ,initialContent}: { children: ReactNode, roomId: string, initialContent: string }) {
  // const room=useRoom();
  // useEffect(()=>{
      
  // },[room]);
  return (
    <LiveblocksProvider
      authEndpoint={`/api/liveblocks-auth/${roomId}`}
      resolveUsers={async ({ userIds }) => {
        const searchParams = new URLSearchParams(
          userIds.map((userId) => ["userIds", userId])
        );
        const response = await fetch(`/api/users?${searchParams}`);

        if (!response.ok) {
          throw new Error("Problem resolving users");
        }

        const users = await response.json();
        return users;
      }}
      resolveMentionSuggestions={async ({ text }) => {
        const response = await fetch(
          `/api/users/search?text=${encodeURIComponent(text)}`
        );

        if (!response.ok) {
          throw new Error("Problem resolving mention suggestions");
        }

        const userIds = await response.json();
        return userIds;
      }}
    >
      <RoomProvider id={'blog-room:'+roomId}
            initialPresence={{
                cursor: null,
              }}
              initialStorage={{
                content: initialContent,
              }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
