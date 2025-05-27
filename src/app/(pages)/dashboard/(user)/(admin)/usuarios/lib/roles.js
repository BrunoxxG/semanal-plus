import { Gem, ShieldUser, User } from "lucide-react";

export const roles = [
  {
    value: "SUPERADMIN",
    label: "SUPERADMIN",
    icon: Gem,
  },
  {
    value: "ADMIN",
    label: "ADMIN",
    icon: ShieldUser,
  },
  {
    value: "BASIC",
    label: "BASIC",
    icon: User,
  },
];