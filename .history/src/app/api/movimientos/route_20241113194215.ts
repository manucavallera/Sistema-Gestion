import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los movimientos
export async function GET(request: NextRequest) {
  try {
    const movimientos = await prisma.movimientoCuenta.findMany();
    return NextResponse.json(movimientos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

// Crear un nuevo movimiento
export async function POST(request: NextRequest) {
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

    const nuevoMovimiento = await prisma.movimientoCuenta.create({
      data: body,
    });

    return NextResponse.json(nuevoMovimiento, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
