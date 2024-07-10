"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useModelsStore } from "@/hooks/use-models-store";
import { useParams, useRouter } from "next/navigation";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 w-4 h-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 w-4 h-4 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});
const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModelsStore();
  const router = useRouter();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);
  const fileType = fileUrl ? fileUrl.split(".").pop() : null;

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative flex items-center hover:bg-black/5 p-4 w-full transition group">
      <div className="flex items-start gap-x-2 w-full group">
        <div
          onClick={onMemberClick}
          className="hover:drop-shadow-md transition cursor-pointer"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-x-2">
            <div onClick={onMemberClick} className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {timestamp}
              </span>
            </div>
            <div>
              {isImage && (
                <a
                  href={fileUrl}
                  target="_black"
                  rel="noopener noreferrer"
                  className="relative flex items-center bg-secondary mt-2 border rounded-md w-48 h-48 overflow-hidden aspect-square"
                >
                  <Image
                    src={fileUrl}
                    alt={content}
                    fill
                    className="object-cover"
                  />
                </a>
              )}
            </div>
            {isPDF && (
              <div className="relative flex flex-col gap-2 mt-2">
                <iframe
                  src={fileUrl}
                  className="mt-4 w-[300px] h-[300px] center object-cover"
                  width="100%"
                  height="100%"
                />
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full text-indigo-500 text-xm hover:underline transition"
                >
                  {fileUrl}
                </a>
              </div>
            )}
            {!fileUrl && !isEditing && (
              <p
                className={cn(
                  "text-sm text-zinc-500 dark:text-zinc-400",
                  deleted &&
                    "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                )}
              >
                {content}
                {isUpdated && !deleted && (
                  <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                    (edited)
                  </span>
                )}
              </p>
            )}
            {!fileUrl && isEditing && (
              <Form {...form}>
                <form
                  className="flex items-center gap-x-2 pt-2 w-full"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="relative w-full">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              disabled={isLoading}
                              {...field}
                              className="border-0 bg-zinc-200/90 dark:bg-zinc-700/75 p-2 border-none text-zinc-600 dark:text-zinc-200 focus-visible-ring-0 focus-visible-ring-offset-0"
                              placeholder="Edited Message"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button disabled={isLoading} size="sm" variant="primary">
                    Save
                  </Button>
                </form>
                <span className="mt-1 text-[10px] text-zinc-400">
                  Press escape to cancel , enter to save
                </span>
              </Form>
            )}
          </div>
        </div>
        {canDeleteMessage && (
          <div className="group-hover:flex -top-2 right-5 absolute items-center gap-x-2 hidden bg-white dark:bg-zinc-800 p-1 border rounded-sm">
            {canEditMessage && (
              <ActionTooltip label="Edit">
                <Edit
                  onClick={() => setIsEditing(!isEditing)}
                  className="ml-auto w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer"
                />
              </ActionTooltip>
            )}
            <ActionTooltip label="Delete">
              <Trash
                onClick={() =>
                  onOpen("deleteMessage", {
                    apiUrl: `${socketUrl}/${id}`,
                    query: socketQuery,
                  })
                }
                className="ml-auto w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer"
              />
            </ActionTooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
