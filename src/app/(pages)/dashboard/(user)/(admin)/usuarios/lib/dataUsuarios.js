import axios from "axios";
import prisma from "@/lib/prisma";
import { Gem, ShieldUser, User } from "lucide-react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function getUsuarios() {
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          not: "canalesluis9@gmail.com",
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tenantId: true,
      },
    });

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    return [];
  }
}

export async function getUsuario(userId, from, to) {
  try {
    const whereClause =
      from && to
        ? {
            date: {
              gte: from,
              lte: to,
            },
          }
        : {};

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tenantId: true,
      },
    });

    if (!user) {
      return null;
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return null;
  }
}

//A TRAVES DE API ROUTES, ENDPOINTS
export async function getUsuariosByApi() {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function getUsuarioByApi(userId, from, to) {
  try {
    const formattedFrom = from ? from.toISOString() : '';
    const formattedTo = to ? to.toISOString() : '';
    
    const response = await axios.get(`${API_URL}/users/${userId}?from=${formattedFrom}&to=${formattedTo}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

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
