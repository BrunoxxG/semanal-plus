"use server"

import { revalidatePath } from "next/cache";
import axios from "axios";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function createCliente(values, userSessionId) {
  try {
    const { name, email, password, phone, address } = values;

    const clientFound = await prisma.client.findFirst({
      where: { email },
    });

    if (clientFound) {
      return { message: `Client with email ${email} already exists`, status: 400, succes: false };
    }

    const userSession = await prisma.user.findUnique({
      where: { id: userSessionId },
      select: {
        name: true,
        tenant: true,
      }
    });

    if (!userSession) {
      return { message: `User with id ${userSessionId} not exists` };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        createdBy: userSession.id,
        createdIn: userSession.tenant.id,
        tenants: {
          connect: {
            id: userSession.tenant.id,
          },
        },
      },
    });

    revalidatePath("/dashboard/clientes");
    return { success: true };
  } catch (error) {
    console.log(error)
    return { error: "An unexpected error occurred", error, success: false };
  }
}

export async function updateCliente(values, clienteId) {
  if (!clienteId) {
    return { message: "Client ID is required", success: false };
  }

  if (values.password === "") {
    delete values.password;
  }

  try {
    if (values.password) {
      values.password = await bcrypt.hash(values.password, 10);
    }

    const updatedClient = await prisma.client.update({
      where: { id: clienteId },
      data: values,
    });

    if (!updatedClient) {
      return { message: "Client not update", success: false };
    }

    return { success: true };
  } catch (error) {
    return { message: "Error updating client", error, success: false };
  }
}

export async function deleteCliente(clienteId) {
  try {
    const client = await prisma.client.delete({
      where: { id: clienteId },
    });
    if (!client) {
      return { message: "Client not found", success: false };
    }
    return { message: "Deleted client", success: true };
  } catch (error) {
    return { message: "Error deleting client", error, success: false };
  }
}