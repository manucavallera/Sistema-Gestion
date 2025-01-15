// src/app/api/movimientos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Registrar un nuevo movimiento
export async function POST(request: Request) {
  const { tipo, monto, clienteId, proveedorId, referencia } =
    await request.json();

  if (!clienteId && !proveedorId) {
    return NextResponse.json(
      { error: "Debe especificar un cliente o proveedor" },
      { status: 400 }
    );
  }

  const saldoAnterior = clienteId
    ? await prisma.movimientoCuenta.findFirst({
        where: { clienteId },
        orderBy: { fecha: "desc" },
      })
    : await prisma.movimientoCuenta.findFirst({
        where: { proveedorId },
        orderBy: { fecha: "desc" },
      });

  const saldoActual = saldoAnterior ? saldoAnterior.saldo : 0;
  const nuevoSaldo =
    tipo === "credito" ? saldoActual + monto : saldoActual - monto;

  try {
    const movimiento = await prisma.movimientoCuenta.create({
      data: {
        tipo,
        monto,
        saldo: nuevoSaldo,
        clienteId,
        proveedorId,
        referencia,
      },
    });
    return NextResponse.json(movimiento);
  } catch (error) {
    console.error("Error al registrar movimiento:", error);
    return NextResponse.json(
      { error: "Error al registrar movimiento" },
      { status: 500 }
    );
  }
}

// Obtener movimientos filtrados por cliente o proveedor
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clienteId = searchParams.get("clienteId");
  const proveedorId = searchParams.get("proveedorId");

  try {
    const movimientos = await prisma.movimientoCuenta.findMany({
      where: {
        ...(clienteId && { clienteId: parseInt(clienteId) }),
        ...(proveedorId && { proveedorId: parseInt(proveedorId) }),
      },
      orderBy: { fecha: "desc" },
    });
    return NextResponse.json(movimientos);
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return NextResponse.json(
      { error: "Error al obtener movimientos" },
      { status: 500 }
    );
  }
}
