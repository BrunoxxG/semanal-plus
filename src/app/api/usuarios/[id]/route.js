import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const whereClause =
      fromDate && toDate
        ? {
            date: {
              gte: fromDate,
              lte: toDate,
            },
          }
        : undefined;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Usuario not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json({ message: "Error getting user" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not update" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 202 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Error updating user", error }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted user" }, { status: 202 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
  }
}
