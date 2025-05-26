import prisma from "@/lib/prisma";
import axios from "axios";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function getSucursales() {
  try {
    const sucursales = await prisma.tenant.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });

    return JSON.parse(JSON.stringify(sucursales));
  } catch (error) {
    return [];
  }
}

export async function getSucursal(sucursalId, from, to) {
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

    const sucursal = await prisma.tenant.findUnique({
      where: { id: sucursalId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!sucursal) {
      return null;
    }

    return JSON.parse(JSON.stringify(sucursal));
  } catch (error) {
    return null;
  }
}

//A TRAVES DE API ROUTES, ENDPOINTS
export async function getSucursalesByApi() {
  try {
    const response = await axios.get(`${API_URL}/sucursales`);
    return response.data;
  } catch (error) {
    return [];
  }
}