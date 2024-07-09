"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModelsStore } from "@/hooks/use-models-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, CopyIcon, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

const InviteModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModelsStore();
  const origin = useOrigin();
  const isModalOpen = isOpen && type === "invite";
  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 text-black overflow-hidden">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="flex flex-col justify-center items-center w-full h-full">
            <p className="border-gray-100 mb-4 p-2 border-b-2 w-full font-bold text-2xl text-center">
              Invite Friends
            </p>
          </DialogTitle>
          <DialogDescription className="flex flex-col justify-center items-center w-full h-full text-center text-sm text-zinc-500">
            Invite your friends to join your server!
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="mb-2 font-bold text-xs text-zinc-500 dark:text-secondary/70 uppercase">
            Server Invite Link
          </Label>
          <div className="flex items-center gap-x-2 mt-2">
            <Input
              disabled={isLoading}
              className="border-0 bg-zinc-300/50 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} size="icon">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <CopyIcon onClick={onCopy} className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            variant={"link"}
            size="sm"
            className="mt-4 text-xs text-zinc-500"
          >
            Generate a new Link
            <RefreshCw className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
