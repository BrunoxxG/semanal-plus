import { NextResponse } from "next/server";


export async function GET(request) {
  try {
    
    const users = "clienteessss en la base de datos";

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json({ message: "Error retrieving user" }, { status: 500 });
  }
}
