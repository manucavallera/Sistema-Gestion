// src/app/api/clientes/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany();
    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  const { razonSocial, direccion, cuit, zona, telefono, email, saldo } =
    await request.json();

  try {
    const nuevoCliente = await prisma.cliente.create({
      data: {
        razonSocial,
        direccion,
        cuit,
        zona,
        telefono,
        email,
        saldo: saldo || 0,
      },
    });
    return NextResponse.json(nuevoCliente, { status: 201 });
  } catch (error) {
    return NextResponse.error();
  }
}
