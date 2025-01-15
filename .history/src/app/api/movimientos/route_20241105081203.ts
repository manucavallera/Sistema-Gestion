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
    const { tipo, monto, clienteId, referencia } = await req.json();

    // Validar los campos requeridos
    if (!tipo || !monto || !clienteId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Obtener el saldo actual del cliente
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });
    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Calcular el nuevo saldo
    const nuevoSaldo =
      tipo === "credito" ? cliente.saldo + monto : cliente.saldo - monto;

    // Crear el movimiento y actualizar el saldo del cliente
    const nuevoMovimiento = await prisma.movimientoCuenta.create({
      data: {
        tipo,
        monto,
        saldo: nuevoSaldo, // Guardar el saldo actualizado en el movimiento
        clienteId,
        referencia,
      },
    });

    // Actualizar el saldo del cliente
    await prisma.cliente.update({
      where: { id: clienteId },
      data: { saldo: nuevoSaldo },
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
