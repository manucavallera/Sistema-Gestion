// src/app/api/movimientos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { tipo, monto, clienteId, proveedorId, referencia } =
      await req.json();

    // Buscar el último saldo registrado para calcular el nuevo saldo
    const ultimoMovimiento = await prisma.movimientoCuenta.findFirst({
      orderBy: { fecha: "desc" },
      select: { saldo: true },
    });

    const saldoAnterior = ultimoMovimiento?.saldo || 0;
    const saldoNuevo =
      tipo === "credito" ? saldoAnterior + monto : saldoAnterior - monto;

    // Crear el nuevo movimiento en la base de datos
    const movimiento = await prisma.movimientoCuenta.create({
      data: {
        tipo,
        monto,
        saldo: saldoNuevo,
        clienteId,
        proveedorId,
        referencia,
      },
    });

    return NextResponse.json(movimiento);
  } catch (error) {
    console.error("Error registrando movimiento:", error);
    return NextResponse.json(
      { error: "Error registrando movimiento" },
      { status: 500 }
    );
  }
}
