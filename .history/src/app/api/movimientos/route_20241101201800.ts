// src/app/api/movimientos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { tipo, monto, clienteId, proveedorId, referencia } =
    await request.json();

  if (!clienteId && !proveedorId) {
    return NextResponse.json(
      { error: "Debe especificar un cliente o proveedor" },
      { status: 400 }
    );
  }

  // Obtener el saldo actual del cliente o proveedor
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
