"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField } from "../ui/form";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import axios from "axios";
import qs from "query-string";
import { useModelsStore } from "@/hooks/use-models-store";
import { EmojiPicker } from "../emoji-picker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModelsStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormControl>
              <div className="relative p-4 pb-6">
                <button
                  className="top-7 left-8 absolute flex justify-center items-center bg-zinc-500 hover:bg-zinc-600 darK:hover:bg-zonc-300 dark:bg-zinc-400 p-1 rounded-full w-[24px] h-[24px] transition"
                  onClick={() => onOpen("messageFile", { apiUrl, query })}
                  type="button"
                >
                  <Plus className="text-white dark:text-[#313338]" />
                </button>
                <Input
                  disabled={isLoading}
                  className="border-0 bg-zinc-200/90 dark:bg-zinc-700/75 px-14 py-6 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  placeholder={`Message ${
                    type === "conversation" ? name : "#" + name
                  }`}
                  {...field}
                />
                <div className="top-7 right-8 absolute">
                  <EmojiPicker
                    onChange={(emoji: string) => {
                      field.onChange(`${field.value} ${emoji}`);
                    }}
                  />
                </div>
              </div>
            </FormControl>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
