// src/app/api/movimientos/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();
  const { tipo, monto, tipoPago, clienteId, proveedorId } = data;

  try {
    // Obtener el saldo actual
    const movimientos = await prisma.movimientoCuenta.findMany({
      where: {
        clienteId: clienteId ? Number(clienteId) : undefined,
      },
      orderBy: {
        fecha: "desc",
      },
    });

    // Calcular el nuevo saldo
    const saldoActual = movimientos.reduce((total, movimiento) => {
      return movimiento.tipo === "credito"
        ? total + movimiento.monto
        : total - movimiento.monto;
    }, 0);

    const nuevoSaldo =
      tipo === "credito" ? saldoActual + monto : saldoActual - monto;

    // Crear el nuevo movimiento
    const movimiento = await prisma.movimientoCuenta.create({
      data: { tipo, monto, saldo: nuevoSaldo, clienteId, proveedorId },
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
    const movimientos = await prisma.movimientoCuenta.findMany({
      where: {
        clienteId: clienteId ? Number(clienteId) : undefined,
      },
      orderBy: {
        fecha: "desc",
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
