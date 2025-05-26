"use server"

import { revalidatePath } from "next/cache";
import axios from "axios";
import prisma from "@/lib/prisma";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function createSucursal(values) {
  try {
    const { name, userId } = values;

    const sucursalFound = await prisma.tenant.findUnique({
      where: { name },
    });

    if (sucursalFound) {
      return { message: `Sucursal with email ${email} already exists`, status: 400, succes: false };
    }

    await prisma.tenant.create({
      data: {
        name,
        userId
      },
    });

    revalidatePath("/dashboard/sucursales");
    return { success: true };
  } catch (error) {
    console.log(error)
    return { error: "An unexpected error occurred", error, success: false };
  }
}

export async function updateSucursal(values, tenantId) {
  if (!tenantId) {
    return { message: "Tenant ID is required", success: false};
  }

  try {

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: values,
    });

    if (!updatedTenant) {
      return { message: "Tenant not update", success: false };
    }

    return { success: true };
  } catch (error) {
    return { message: "Error updating tenant", error, success: false };
  }
}

export async function deleteSucursal(tenantId) {
  try {
    const sucursal = await prisma.tenant.delete({
      where: { id: tenantId },
    });
    if (!sucursal) {
      return { message: "Tenant not found", success: false };
    }
    return { message: "Deleted tenant", success: true };
  } catch (error) {
    return { message: "Error deleting tenant", error, success: false };
  }
}