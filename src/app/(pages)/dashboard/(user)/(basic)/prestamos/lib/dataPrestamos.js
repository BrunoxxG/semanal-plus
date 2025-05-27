"use server";

import axios from "axios";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { auth } from "@/auth";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function getPrestamos() {
  try {

    const { user } = await auth();

    const cookieStore = await cookies();
    const tenantId = cookieStore.get("selectedTenantId")?.value || user?.tenantId;

    const loans = await prisma.loan.findMany({
      where: {
        tenants: {
          some: {
            tenantId,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        
      },
    });

    return JSON.parse(JSON.stringify(loans));
  } catch (error) {
    return [];
  }
}

export async function getPrestamo(loanId, from, to) {
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

    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      select: {
        id: true,
      },
    });

    if (!loan) {
      return null;
    }

    return JSON.parse(JSON.stringify(loan));
  } catch (error) {
    return null;
  }
}
