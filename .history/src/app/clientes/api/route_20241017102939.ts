import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const clientes = await prisma.cliente.findMany(); // Obtiene todos los clientes de la base de datos
  return NextResponse.json(clientes);
}

export async function POST(request: Request) {
  const nuevoCliente = await request.json();

  // Crea un nuevo cliente en la base de datos
  const clienteCreado = await prisma.cliente.create({
    data: nuevoCliente,
  });

  return NextResponse.json(clienteCreado);
}

export async function PUT(request: Request) {
  const { id, ...actualizado } = await request.json();

  // Actualiza el cliente en la base de datos
  const clienteActualizado = await prisma.cliente.update({
    where: { id },
    data: actualizado,
  });

  return NextResponse.json(clienteActualizado);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  // Elimina el cliente de la base de datos
  await prisma.cliente.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Cliente eliminado" });
}
