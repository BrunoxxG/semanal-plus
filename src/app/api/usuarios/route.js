import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    const userFound = await prisma.user.findUnique({
      where: { email },
    });

    if (userFound) {
      return NextResponse.json({ message: `User with email ${email} already exists` }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: "SUPERADMIN",
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "Users not found" }, { status: 404 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json({ message: "Error retrieving user" }, { status: 500 });
  }
}
