"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModelsStore } from "@/hooks/use-models-store";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const DeleteServerModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModelsStore();
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/servers/${server?.id}`);

      onClose();
      router.refresh();
      router.push("/");
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
              Delete Server
            </p>
          </DialogTitle>
          <DialogDescription className="w-full h-full text-center text-sm text-zinc-500">
            Are you sure you want to Delete -
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            , this action cannot be undone!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onClick} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
