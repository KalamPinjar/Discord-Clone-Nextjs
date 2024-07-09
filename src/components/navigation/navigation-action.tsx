"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModelsStore } from "@/hooks/use-models-store";

const NavigationAction = () => {
  const { onOpen } = useModelsStore();

  return (
    <div>
      <ActionTooltip label="Create Server" side="right" align="center">
        <button
          onClick={() => onOpen("createServer")}
          className="flex items-center group"
        >
          <div className="group-hover:bg-emerald-500 flex justify-center items-center bg-background dark:bg-neutral-700 mx-3 rounded-[24px] group-hover:rounded-[16px] w-[48px] h-[48px] transition-all overflow-hidden">
            <Plus
              size={25}
              className="group-hover:text-white text-emerald-500 transition"
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
