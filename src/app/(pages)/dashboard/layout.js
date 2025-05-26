import { auth } from "@/auth";
import { Navbar, SideNav } from "./components";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex w-full h-full">
      <div className="hidden xl:block w-80 h-screen xl:fixed">
        <SideNav />
      </div>
      <div className="flex flex-col w-full min-h-screen xl:ml-80">
        <Navbar />
        <div className="flex-1 p-6 bg-secondary">{children}</div>
      </div>
    </div>
  );
}