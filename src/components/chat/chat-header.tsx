import { Hash } from "lucide-react";
import MoblieToggle from "../moblie-toggle";
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import ChatVideoButton from "./chat-video-button";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="flex items-center border-neutral-20 dark:border-neutral-800 px-3 border-b-2 h-12 font-semibold text-md">
      <MoblieToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="mr-2 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === "conversation" && (
        <UserAvatar className="mr-2 w-8 md:w-10 h-8 md:h-10" src={imageUrl} />
      )}
      <p className="font-semibold text-black text-md dark:text-white">{name}</p>
      <div className="flex items-center ml-auto">
        {type === "conversation" && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
