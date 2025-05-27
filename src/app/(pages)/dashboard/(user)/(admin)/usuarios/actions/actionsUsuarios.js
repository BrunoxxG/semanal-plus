"use server"

import { revalidatePath } from "next/cache";
import axios from "axios";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function createUsuario(values) {
  try {
    const { name, email, password, role, tenantId } = values;

    const userFound = await prisma.user.findUnique({
      where: { email },
    });

    if (userFound) {
      return { message: `User with email ${email} already exists`, status: 400, succes: false };
    }

    const { user } = await auth();

    const tenant = user?.role === "SUPERADMIN" ? tenantId : user.tenantId;


    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        tenantId,
      },
    });

    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred", error, success: false };
  }
}

export async function updateUsuario(values, usuarioId) {
  if (!usuarioId) {
    return { message: "User ID is required", success: false};
  }

  if (values.password === "") {
    delete values.password;
  }

  try {
    if (values.password) {
      values.password = await bcrypt.hash(values.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: usuarioId },
      data: values,
    });

    if (!updatedUser) {
      return { message: "User not update", success: false };
    }

    return { success: true };
  } catch (error) {
    return { message: "Error updating user", error, success: false };
  }
}

export async function deleteUsuario(usuarioId) {
  try {
    const user = await prisma.user.delete({
      where: { id: usuarioId },
    });
    if (!user) {
      return { message: "User not found", success: false };
    }
    return { message: "Deleted user", success: true };
  } catch (error) {
    return { message: "Error deleting user", error, success: false };
  }
}


// export async function createUsuario(values) {
//   try {
//     const { status } = await axios.post(`${API_URL}/usuarios`, values, {
//       headers: { "Content-Type": "application/json" },
//     });
//     if(status !== 201){
//       return { success: false };
//     }
//     revalidatePath("/dashboard/usuarios");
//     return { success: true };
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       return { error: error.response.data.message || "An error occurred" , success: false };
//     }
//     return { error: "An unexpected error occurred", success: false };
//   }
// }

// export async function updateUsuario(values, usuarioId) {
//   try {
//     const { status } = await axios.patch(`${API_URL}/usuarios/${usuarioId}`, values, {
//       headers: { "Content-Type": "application/json" },
//     });
//     if(status !== 202){
//       return { success: false };
//     }
//     revalidatePath("/dashboard/usuarios");
//     return { success: true };
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       return { error: error.response.data.message || "An error occurred" };
//     }
//     return { error: "An unexpected error occurred" };
//   }
// }

// export async function deleteUsuario(usuarioId) {
//   try {
//     const { status } = await axios.delete(`${API_URL}/usuarios/${usuarioId}`);
//     if(status !== 202){
//       return { success: false };
//     }
//     revalidatePath("/dashboard/usuarios");
//     return { success: true };
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       return { error: error.response.data.message || "An error occurred" };
//     }
//     return { error: "An unexpected error occurred" };
//   }
// }