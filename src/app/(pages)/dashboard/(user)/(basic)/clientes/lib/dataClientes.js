"use server";

import axios from "axios";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { auth } from "@/auth";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function getClientes() {
  try {

    const { user } = await auth();

    const cookieStore = await cookies();
    const tenantId = cookieStore.get("selectedTenantId")?.value || user?.tenantId;

    const clients = await prisma.client.findMany({
      where: {
        tenants: {
          some: {
            tenantId,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        dni: true,
        email: true,
        phone: true,
        address: true,
        bankAccount: true,
        imageDniFront: true,
        imageDniBack: true,
        tenants: {
          select: {
            tenant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedClients = clients.map((client) => ({
      ...client,
      tenants: client.tenants.map((t) => ({
        name: t.tenant.name,
      })),
    }));

    return JSON.parse(JSON.stringify(formattedClients));
  } catch (error) {
    return [];
  }
}

export async function getCliente(clientId, from, to) {
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

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        dni: true,
        email: true,
        phone: true,
        address: true,
        bankAccount: true,
        imageDniFront: true,
        imageDniBack: true,
        tenants: {
          select: {
            tenant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!client) {
      return null;
    }

    const formattedClient = {
      ...client,
      tenants: client.tenants.map((t) => ({
        name: t.tenant.name,
      })),
    };

    return JSON.parse(JSON.stringify(formattedClient));
  } catch (error) {
    return null;
  }
}

//A TRAVES DE API ROUTES, ENDPOINTS
export async function getClientesByApi() {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function getClienteByApi(clientId, from, to) {
  try {
    const formattedFrom = from ? from.toISOString() : '';
    const formattedTo = to ? to.toISOString() : '';

    const response = await axios.get(`${API_URL}/clients/${clientId}?from=${formattedFrom}&to=${formattedTo}`);
    return response.data;
  } catch (error) {
    return null;
  }
}
