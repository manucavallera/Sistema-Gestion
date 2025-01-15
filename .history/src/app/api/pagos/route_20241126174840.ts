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
      montoMovimiento: pago.movimiento?.monto ?? null,
      proveedor:
        pago.movimiento?.proveedor?.nombre ?? "Proveedor no disponible",
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
    const { monto, movimientoId, metodoPago } = body;

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
    const movimiento = await prisma.movimiento.findUnique({
      // Cambiado a 'movimiento'
      where: { id: movimientoId },
    });

    if (!movimiento) {
      return NextResponse.json(
        { error: "El movimientoId proporcionado no existe." },
        { status: 404 }
      );
    }

    // Validar que metodoPago sea uno de los valores esperados
    const metodosPagoValidos = ["EFECTIVO", "TARJETA", "TRANSFERENCIA"];
    if (!metodosPagoValidos.includes(metodoPago)) {
      return NextResponse.json(
        { error: "Método de pago inválido." },
        { status: 400 }
      );
    }

    const nuevoPago = await prisma.pago.create({
      data: {
        monto,
        movimientoId,
        metodoPago,
      },
    });

    return NextResponse.json(nuevoPago, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: "Error al crear el pago." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Cierra la conexión de Prisma
  }
}
