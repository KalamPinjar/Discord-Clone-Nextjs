import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
}

const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 mb-4 px-4">
      {type === "channel" && (
        <div className="flex justify-center items-center bg-zinc-500 dark:bg-zinc-700 rounded-full w-[75px] h-[75px] overflow-hidden">
          <Hash className="w-12 h-12 text-white" />
        </div>
      )}
      <p className="font-bold text-xl md:text-3xl">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text0sm">
        {type === "channel"
          ? `This is the start of the #${name}`
          : `This is the start of the conversation with ${name}`}
      </p>
    </div>
  );
};

export default ChatWelcome;
