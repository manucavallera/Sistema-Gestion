// src/app/api/movimientos/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();
  const { tipo, monto, tipoPago, clienteId } = data;

  try {
    const movimiento = await prisma.movimientoCuentaCorriente.create({
      data: { tipo, monto, tipoPago, clienteId },
    });
    return NextResponse.json({ movimiento }, { status: 201 });
  } catch (error) {
    console.error("Error al crear movimiento:", error);
    return NextResponse.json(
      { message: "Error al crear movimiento" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const clienteId = url.searchParams.get("clienteId");

  try {
    const movimientos = await prisma.movimientoCuentaCorriente.findMany({
      where: {
        clienteId: clienteId ? Number(clienteId) : undefined,
      },
    });
    return NextResponse.json({ movimientos }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return NextResponse.json(
      { message: "Error al obtener movimientos" },
      { status: 500 }
    );
  }
}
