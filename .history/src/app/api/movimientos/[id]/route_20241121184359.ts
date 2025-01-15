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
        { error: "Movimiento no encontrado." },
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
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Convertir 'monto' a número
    const monto = Number(body.monto);

    // Validación de datos
    if (isNaN(monto) || monto <= 0) {
      return NextResponse.json(
        {
          error: "El campo 'monto' debe ser un número positivo.",
        },
        { status: 400 }
      );
    }

    if (!["CREDITO", "DEBITO"].includes(body.tipo)) {
      return NextResponse.json(
        {
          error: "El campo 'tipo' debe ser 'CREDITO' o 'DEBITO'.",
        },
        { status: 400 }
      );
    }

    // Asegúrate de que todos los campos requeridos estén presentes
    const camposRequeridos = ["monto", "tipo", "estado"]; // Añade otros campos requeridos si es necesario
    for (const campo of camposRequeridos) {
      if (!(campo in body)) {
        return NextResponse.json(
          { error: `El campo '${campo}' es requerido.` },
          { status: 400 }
        );
      }
    }

    const movimientoActualizado = await prisma.movimientoCuenta.update({
      where: { id: parseInt(params.id) },
      data: {
        ...body,
        monto, // Asegúrate de usar el monto convertido
      },
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
      message: "Movimiento eliminado.",
      movimiento: movimientoEliminado,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Movimiento no encontrado." },
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
