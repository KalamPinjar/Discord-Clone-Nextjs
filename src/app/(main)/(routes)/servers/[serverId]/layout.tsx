import { ServerSideBar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <div className="z-20 fixed inset-y-0 md:flex flex-col hidden w-60 h-full">
        <ServerSideBar serverId={params.serverId} />
      </div>
      <main className="md:pl-60 h-screen">{children}</main>
    </div>
  );
};

export default ServerLayout;
