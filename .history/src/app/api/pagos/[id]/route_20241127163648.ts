import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const pago = await prisma.pago.findUnique({
      where: { id: Number(id) },
    });

    if (!pago) {
      return NextResponse.json(
        { error: "Pago no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(pago, { status: 200 });
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener el pago." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validar que el ID sea un número
  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { monto, estado } = body;

    // Validar que los campos requeridos estén presentes
    if (typeof monto !== "number" || !estado) {
      return NextResponse.json(
        {
          error:
            "Datos inválidos. Asegúrate de que monto y estado estén presentes.",
        },
        { status: 400 }
      );
    }

    const pagoActualizado = await prisma.pago.update({
      where: { id: Number(id) },
      data: {
        monto,
        estado,
      },
    });

    return NextResponse.json(pagoActualizado, { status: 200 });
  } catch (error) {
    console.error("Error en PUT:", error);
    return NextResponse.json(
      { error: "Error al actualizar el pago." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validar que el ID sea un número
  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    // Verificar si el pago existe antes de intentar eliminarlo
    const pago = await prisma.pago.findUnique({
      where: { id: Number(id) },
    });

    if (!pago) {
      return NextResponse.json(
        { error: "Pago no encontrado." },
        { status: 404 }
      );
    }

    await prisma.pago.delete({
      where: { id: Number(id) },
    });

    // Retornar un código de estado 204 sin cuerpo
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("Error en DELETE:", error);
    return NextResponse.json(
      { error: "Error al eliminar el pago." },
      { status: 500 }
    );
  }
}
