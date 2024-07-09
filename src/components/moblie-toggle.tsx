import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import NavigationSideBar from "./navigation/navigation-sidebar";
import { ServerSideBar } from "./server/server-sidebar";
const MoblieToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} className="md:hidden" size="icon">
          <Menu className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex gap-0 bg-white dark:bg-[#313338] p-0"
      >
        <div className="w-[72px]">
          <NavigationSideBar />
        </div>
        <ServerSideBar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MoblieToggle;
