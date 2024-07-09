

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-items";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSideBar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findMany({
    where: { members: { some: { profileId: profile.id } } },
  });

  return (
    <div className="flex flex-col items-center space-y-4 bg-[#E3E5E8] dark:bg-[#1E1F22] py-3 w-full h-full text-primary">
      <NavigationAction />
      <Separator className="bg-zinc-300 dark:bg-zinc-700 mx-auto rounded-md w-10 h-[2px]" />
      <ScrollArea className="flex-1 h-full">
        {server.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="flex flex-col items-center gap-y-4 mt-auto pb-3">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox:
                "h-[48px] w-[48px] rounded-[24px] bg-background dark:bg-neutral-700",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSideBar;
