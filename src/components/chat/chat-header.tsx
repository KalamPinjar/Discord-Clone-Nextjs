import { Hash } from "lucide-react";
import MoblieToggle from "../moblie-toggle";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="flex items-center border-neutral-20 dark:border-neutral-800 px-3 border-b-2 h-12 font-semibold text-md">
      <MoblieToggle  serverId={serverId} />
      {type === "channel" && (
        <Hash className="mr-2 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      )}
      <p className="font-semibold text-black text-md dark:text-white">{name}</p>
    </div>
  );
};

export default ChatHeader;
