import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIo } from "../../../../types";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(401).json({ message: "Server Id Not Found" });
    }
    if (!channelId) {
      return res.status(401).json({ message: "Channel Id Not Found" });
    }
    if (!content) {
      return res.status(401).json({ message: "Content Not Found" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(401).json({ message: "Server Not Found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });
    if (!channel) {
      return res.status(401).json({ message: "Channel Not Found" });
    }

    const member = server.members.find((m) => m.profileId === profile.id);

    if (!member) {
      return res.status(401).json({ message: "Member Not Found" });
    }
    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channel.id,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json({ message });
  } catch (error) {
    console.log("[MESSAGES_PORT]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
