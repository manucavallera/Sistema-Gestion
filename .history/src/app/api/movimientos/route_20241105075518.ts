// src/app/api/movimientos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// GET: Obtener todos los movimientos de cuenta
export async function GET() {
  try {
    const movimientos = await prisma.movimientoCuenta.findMany();
    return NextResponse.json(movimientos);
  } catch (error) {
    console.error("Error al obtener los movimientos de cuenta:", error);
    return NextResponse.json(
      { error: "Error al obtener los movimientos de cuenta" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo movimiento de cuenta
export async function POST(req: Request) {
  try {
    const { tipo, monto, saldo, clienteId, referencia } = await req.json();

    // Validar los campos requeridos
    if (!tipo || !monto || !clienteId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const nuevoMovimiento = await prisma.movimientoCuenta.create({
      data: {
        tipo,
        monto,
        saldo,
        clienteId,
        referencia,
      },
    });

    return NextResponse.json(nuevoMovimiento, { status: 201 });
  } catch (error) {
    console.error("Error al crear el movimiento de cuenta:", error);
    return NextResponse.json(
      { error: "Error al crear el movimiento de cuenta" },
      { status: 500 }
    );
  }
}
