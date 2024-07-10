"use client";

import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { useRef, ElementRef, Fragment } from "react";
import ChatItem from "./chat-items";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-check-socket";
import { useChatScroll } from "@/hooks/use-check-scroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";
type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const queryKey = `chat:${chatId}`;
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatSocket({
    queryKey,
    addKey,
    updateKey,
  });

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full">
        <Loader2 className="my-4 w-7 h-7 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading Messages...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full">
        <ServerCrash className="my-4 w-7 h-7 text-rose-500" />
        <p className="text-rose-500 text-xs dark:text-rose-400">
          Something went wrong!
        </p>
      </div>
    );
  }
  return (
    <div
      ref={chatRef}
      className="flex flex-col flex-1 dark:bg-[#313338] mt-auto py-4 h-full overflow-y-auto"
    >
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 w-6 h-6 text-zinc-500 animate-spin" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-xs text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 dark:text-zinc-600 transition"
            >
              Load previous message
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages &&
          Object.values(data.pages).map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.items.map((message: MessageWithMemberWithProfile) => (
                <ChatItem
                  key={message.id}
                  id={message.id}
                  member={message.member}
                  currentMember={member}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              ))}
            </Fragment>
          ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
