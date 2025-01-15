import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pagos = await prisma.pago.findMany({
      include: {
        movimiento: {
          include: {
            proveedor: true, // Asegúrate de que la relación con proveedor esté definida en tu modelo
          },
        },
      },
    });

    // Mapeamos los pagos para darles la forma deseada
    const pagosConDetalles = pagos.map((pago) => ({
      id: pago.id,
      monto: pago.monto,
      movimientoId: pago.movimientoId,
      metodoPago: pago.metodoPago,
      montoMovimiento: pago.movimiento?.monto ?? null, // Asegúrate de que 'monto' sea el campo correcto en el movimiento
      proveedor:
        pago.movimiento?.proveedor?.nombre ?? "Proveedor no disponible", // Usamos optional chaining para evitar errores
    }));

    return NextResponse.json(pagosConDetalles, { status: 200 });
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener los pagos." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { monto, movimientoId, metodoPago } = body; // Incluye 'metodoPago'

    // Validar que los campos requeridos estén presentes
    if (typeof monto !== "number" || !movimientoId || !metodoPago) {
      return NextResponse.json(
        {
          error:
            "Datos inválidos. Asegúrate de que monto, movimientoId y metodoPago estén presentes.",
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
        metodoPago, // Asegúrate de incluir 'metodoPago'
      },
    });

    return NextResponse.json(nuevoPago, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: "Error al crear el pago." },
      { status: 500 }
    );
  }
}
