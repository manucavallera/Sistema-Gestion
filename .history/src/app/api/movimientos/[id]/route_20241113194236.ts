import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener un movimiento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movimiento = await prisma.movimientoCuenta.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!movimiento) {
      return NextResponse.json(
        { error: "Movimiento no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(movimiento);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

// Actualizar un movimiento específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validación de datos
    if (
      typeof body.monto !== "number" ||
      body.monto <= 0 ||
      !["CREDITO", "DEBITO"].includes(body.tipo) // Cambiado a CREDITO y DEBITO
    ) {
      return NextResponse.json(
        {
          error:
            "Datos inválidos: monto debe ser un número positivo y tipo debe ser 'CREDITO' o 'DEBITO'.",
        },
        { status: 400 }
      );
    }

    const movimientoActualizado = await prisma.movimientoCuenta.update({
      where: { id: parseInt(params.id) },
      data: body,
    });

    return NextResponse.json(movimientoActualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

// Eliminar un movimiento específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movimientoEliminado = await prisma.movimientoCuenta.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({
      message: "Movimiento eliminado",
      movimiento: movimientoEliminado,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Movimiento no encontrado" },
        { status: 404 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
