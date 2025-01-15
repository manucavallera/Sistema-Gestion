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
    console.error("Error al obtener el cliente:", error);
    return NextResponse.json(
      { error: "Error al obtener el cliente" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { razonSocial, direccion, cuit, zona, telefono, email, saldo } =
    await request.json();

  // Validación básica de datos
  if (!razonSocial || !direccion || !cuit) {
    return NextResponse.json(
      { error: "Faltan datos requeridos" },
      { status: 400 }
    );
  }

  try {
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

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
    console.error("Error al actualizar el cliente:", error);
    return NextResponse.json(
      { error: "Error al actualizar el cliente" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    await prisma.cliente.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Cliente eliminado" }, { status: 204 });
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    return NextResponse.json(
      { error: "Error al eliminar el cliente" },
      { status: 500 }
    );
  }
}
