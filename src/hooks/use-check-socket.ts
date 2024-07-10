import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages) {
          return oldData;
        }

        // Convert pages object to an array
        const pagesArray = Object.values(oldData.pages);
        const updatedPagesArray = pagesArray.map((page: any) => ({
          ...page,
          items: page.items.map((item: MessageWithMemberWithProfile) =>
            item.id === message.id ? message : item
          ),
        }));

        // Convert back to the original object format
        const updatedPagesObject = updatedPagesArray.reduce(
          (acc, page, index) => {
            acc[index.toString()] = page;
            return acc;
          },
          {}
        );

        return {
          ...oldData,
          pages: updatedPagesObject,
        };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        // Initialize newData.pages as an object to preserve the original structure
        const newData = { ...oldData };
        const firstPageIndex = '0'; // Assuming you want to modify the first page

        // Check if there's already data and specifically a first page
        if (oldData && oldData.pages && oldData.pages[firstPageIndex]) {
          // Prepend the new message to the items array of the first page
          newData.pages[firstPageIndex] = {
            ...newData.pages[firstPageIndex],
            items: [message, ...newData.pages[firstPageIndex].items],
          };
        } else {
          // If there's no data yet, initialize with the new message
          newData.pages[firstPageIndex] = {
            items: [message],
          };
        }

        return newData;
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};
