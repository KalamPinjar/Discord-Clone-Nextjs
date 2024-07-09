"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative m- m-20 w-52 h-52">
        <Image
          fill
          className="rounded-full object-cover"
          src={value}
          alt="uploaded image"
        />
        <button
          onClick={() => onChange("")}
          className="top-0 right-0 absolute bg-rose-500 shadow-sm p-1 rounded-full text-white"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex flex-col justify-center items-center gap-2 mt-2">
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full text-center text-indigo-500 text-xm hover:underline transition"
        >
          {value}
        </a>
        <iframe
          src={value}
          className="w-[300px] h-[300px] center object-cover"
          width="100%"
          height="100%"
        />
        <button
          onClick={() => onChange("")}
          className="top-0 right-0 absolute bg-rose-500 shadow-sm p-1 rounded-full text-white"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error) => {
        console.log("ERROR", error);
      }}
    />
  );
};

export default FileUpload;
