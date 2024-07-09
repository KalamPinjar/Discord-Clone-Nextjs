"use client";

import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onChange: (emoji: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Smile className="text-zinc-500 dark:hover:text-zinc-300 hover:text-zinc-600 dark:text-zinc-400 transition cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent
          side="right"
          sideOffset={40}
          className="bg-transparent shadow-none border-none"
        >
          <Picker
            theme={resolvedTheme}
            data={data}
            onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
