"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <ActionTooltip label={name} side="right" align="center">
      <button onClick={() => router.push(`/servers/${id}`)} className="relative flex items-center group">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId === id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative mx-3 flex group h-[48px] w-[48px] rounded-[24px] group:hover:rounded-[16px] items-center justify-center transition-all overflow-hidden",
            params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"  
          )}
        >
          <Image
          fill
            src={imageUrl}
            alt={name}
            className="group-hover:text-white text-background dark:text-primary transition-all"
            
          />
        </div>
      </button>
    </ActionTooltip>
  );
};
