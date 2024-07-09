import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col bg-white dark:bg-[#313338] h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <div className="flex-1">
        <ChatMessages
          member={member}
          name={channel.name}
          chatId={channel.id}
          type="channel"
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
          paramKey="channelId"
          paramValue={channel.id}
        />
      </div>
      <ChatInput
        apiUrl={`/api/socket/messages`}
        name={channel.name}
        type="channel"
        query={{ channelId: channel.id, serverId: channel.serverId }}
      />
    </div>
  );
};

export default ChannelIdPage;
