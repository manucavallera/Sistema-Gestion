import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pagos = await prisma.pago.findMany();
    return NextResponse.json(pagos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los pagos." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { monto, movimientoId } = body; // Solo incluye 'monto' y 'movimientoId'

    // Validar que los campos requeridos estén presentes
    if (typeof monto !== "number" || !movimientoId) {
      return NextResponse.json(
        {
          error:
            "Datos inválidos. Asegúrate de que monto y movimientoId estén presentes.",
        },
        { status: 400 }
      );
    }

    // Verifica si el movimientoId existe en la base de datos
    const movimiento = await prisma.movimientoCuenta.findUnique({
      where: { id: movimientoId },
    });

    if (!movimiento) {
      return NextResponse.json(
        { error: "El movimientoId proporcionado no existe." },
        { status: 404 }
      );
    }

    const nuevoPago = await prisma.pago.create({
      data: {
        monto,
        movimientoId, // Asegúrate de incluir 'movimientoId'
      },
    });

    return NextResponse.json(nuevoPago, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear el pago." },
      { status: 500 }
    );
  }
}
