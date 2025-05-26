import { NavLinks } from ".";
import { auth } from "@/auth"

export default async function SideNav() {
  const session = await auth();

  return (
    <div className="h-full flex flex-col border-r">
      <NavLinks user={session?.user}/>
    </div>
  );
}
