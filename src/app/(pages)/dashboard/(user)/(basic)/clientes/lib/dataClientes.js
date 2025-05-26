import axios from "axios";
import prisma from "@/lib/prisma";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function getClientes() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
      },
    });

    return JSON.parse(JSON.stringify(clients));
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
        email: true,
        phone: true,
        address: true,
      },
    });

    if (!user) {
      return null;
    }

    return JSON.parse(JSON.stringify(client));
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
