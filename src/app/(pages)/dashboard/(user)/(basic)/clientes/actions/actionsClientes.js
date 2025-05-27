"use server"

import { revalidatePath } from "next/cache";
import axios from "axios";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import CloudinaryModel from "@/lib/cloudinary";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function createCliente(values) {
  try {
    const { name, email, password, phone, address, bankAccount, dni, imageDniFront, imageDniBack } = values;

    const clientFound = await prisma.client.findFirst({
      where: { email },
    });

    if (clientFound) {
      return { message: `Client with email ${email} already exists`, status: 400, succes: false };
    }

    let imageFrontUrl = null;
    if (imageDniFront instanceof File) {
      const arrayBufferFront = await imageDniFront.arrayBuffer();
      const bufferFront = Buffer.from(arrayBufferFront);

      imageFrontUrl = await CloudinaryModel.uploadImage(
        bufferFront,
        `${dni}-${name.replace(/\s+/g, '')}-DniFront`,
        `clientes/${name}`
      );
    }

    let imageBackUrl = null;
    if (imageDniBack instanceof File) {
      const arrayBufferBack = await imageDniBack.arrayBuffer();
      const bufferBack = Buffer.from(arrayBufferBack);

      imageBackUrl = await CloudinaryModel.uploadImage(
        bufferBack,
        `${dni}-${name.replace(/\s+/g, '')}-DniBack`,
        `clientes/${name}`
      );
    }

    const { user } = await auth();

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.client.create({
      data: {
        name,
        dni,
        email,
        password: hashedPassword,
        phone,
        address,
        bankAccount,
        imageDniFront: imageFrontUrl,
        imageDniBack: imageBackUrl,
        createdById: user.id,
        createdInId: user.tenantId,
        tenants: {
          create: {
            tenantId: user.tenantId,
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

  if (values.imageDniFront === "") {
    delete values.imageDniFront;
  }

  if (values.imageDniBack === "") {
    delete values.imageDniBack;
  }

  try {
    if (values.password) {
      values.password = await bcrypt.hash(values.password, 10);
    }

    if (values.imageDniFront instanceof File) {
      const arrayBufferFront = await values.imageDniFront.arrayBuffer();
      const bufferFront = Buffer.from(arrayBufferFront);

      values.imageDniFront = await CloudinaryModel.uploadImage(
        bufferFront,
        `${values.dni}-${values.name.replace(/\s+/g, '')}-DniFront`,
        `clientes/${values.name}`
      );
    }

    if (values.imageDniBack instanceof File) {
      const arrayBufferBack = await values.imageDniBack.arrayBuffer();
      const bufferBack = Buffer.from(arrayBufferBack);

      values.imageDniBack = await CloudinaryModel.uploadImage(
        bufferBack,
        `${values.dni}-${values.name.replace(/\s+/g, '')}-DniBack`,
        `clientes/${values.name}`
      );
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