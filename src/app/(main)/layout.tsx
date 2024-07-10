import NavigationSideBar from "@/components/navigation/navigation-sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <div className="z-30 fixed inset-y-0 md:flex flex-col hidden w-[72px]">
        <NavigationSideBar />
      </div>
      <main className="md:pl-[72px]">{children}</main>
    </div>
  );
};

export default MainLayout;
