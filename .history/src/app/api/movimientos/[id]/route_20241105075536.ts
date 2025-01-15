// src/app/api/movimientos/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// GET: Obtener un movimiento de cuenta por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movimientoId = Number(params.id);
    if (isNaN(movimientoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const movimiento = await prisma.movimientoCuenta.findUnique({
      where: { id: movimientoId },
    });

    return movimiento
      ? NextResponse.json(movimiento)
      : NextResponse.json(
          { error: "Movimiento no encontrado" },
          { status: 404 }
        );
  } catch (error) {
    console.error("Error al obtener el movimiento:", error);
    return NextResponse.json(
      { error: "Error al obtener el movimiento" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un movimiento de cuenta por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movimientoId = Number(params.id);
    if (isNaN(movimientoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const data = await req.json();

    // Validar que los campos necesarios estén presentes
    if (!data.tipo || !data.monto || !data.clienteId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const updatedMovimiento = await prisma.movimientoCuenta.update({
      where: { id: movimientoId },
      data,
    });

    return NextResponse.json(updatedMovimiento);
  } catch (error) {
    console.error("Error al actualizar el movimiento:", error);
    return NextResponse.json(
      { error: "Error al actualizar el movimiento" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un movimiento de cuenta por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movimientoId = Number(params.id);
    if (isNaN(movimientoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.movimientoCuenta.delete({
      where: { id: movimientoId },
    });
    return NextResponse.json({ message: "Movimiento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el movimiento:", error);
    return NextResponse.json(
      { error: "Error al eliminar el movimiento" },
      { status: 500 }
    );
  }
}
