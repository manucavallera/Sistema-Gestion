import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las ventas y la lista de clientes
export async function GET() {
  try {
    const [ventas, clientes] = await Promise.all([
      prisma.venta.findMany(),
      prisma.cliente.findMany(),
    ]);

    return NextResponse.json({ ventas, clientes });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener las ventas y clientes" },
      { status: 500 }
    );
  }
}
