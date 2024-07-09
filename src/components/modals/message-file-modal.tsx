"use client";

import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModelsStore } from "@/hooks/use-models-store";
import qs from "query-string";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "Attachment is required" }),
});

const MessageFileModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModelsStore();
  const { apiUrl, query } = data;
  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white p-0 text-black overflow-hidden">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="flex flex-col justify-center items-center w-full h-full">
            <p className="border-gray-100 mb-4 p-2 border-b-2 w-full font-bold text-2xl text-center">
              Add an Attachment
            </p>
          </DialogTitle>
          <DialogDescription className="flex flex-col justify-center items-center w-full h-full text-center text-sm text-zinc-500">
            Add an attachment to your message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
              <div className="flex flex-col gap-4 w-3/4 text-start">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem className="w-full text-center">
                      <FormLabel className="font-bold text-xs text-zinc-500 dark:text-secondary/70 uppercase">
                        File URL
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="px-6 py-4">
                <Button variant={"primary"} type="submit" disabled={isLoading}>
                  Send
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
