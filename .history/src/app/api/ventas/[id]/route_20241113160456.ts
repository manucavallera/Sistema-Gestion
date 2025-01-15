import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear una nueva venta
export async function POST(req: Request) {
  const { fecha, total, clienteId } = await req.json();
  try {
    const nuevaVenta = await prisma.venta.create({
      data: {
        fecha,
        total,
        clienteId,
      },
    });
    return NextResponse.json(nuevaVenta, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear la venta" },
      { status: 500 }
    );
  }
}

// Obtener todas las ventas
export async function GET() {
  try {
    const ventas = await prisma.venta.findMany();
    return NextResponse.json(ventas);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener las ventas" },
      { status: 500 }
    );
  }
}
