import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  
}

export async function GET(request) {
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

    if (sucursales.length === 0) {
      return NextResponse.json({ message: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json(sucursales, { status: 200 });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json({ message: "Error retrieving user" }, { status: 500 });
  }
}
