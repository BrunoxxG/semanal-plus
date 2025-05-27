"use server";

import axios from "axios";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { auth } from "@/auth";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function getUsuarios() {
  try {

    const { user } = await auth();

    const cookieStore = await cookies();
    const tenantId = cookieStore.get("selectedTenantId")?.value || user?.tenantId;

    const users = await prisma.user.findMany({
      where: {
        tenantId,
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
