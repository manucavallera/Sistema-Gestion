// src/app/api/clientes/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });
    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(cliente);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { razonSocial, direccion, cuit, zona, telefono, email, saldo } =
    await request.json();

  try {
    const clienteActualizado = await prisma.cliente.update({
      where: { id: parseInt(id) },
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
    return NextResponse.json(clienteActualizado);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.cliente.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Cliente eliminado" }, { status: 204 });
  } catch (error) {
    return NextResponse.error();
  }
}
