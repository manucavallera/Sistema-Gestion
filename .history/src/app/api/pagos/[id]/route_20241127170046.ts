import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, PrismaClientKnownRequestError } from "@prisma/client";

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

    await prisma.pago.delete({
      where: { id: Number(id) },
    });

    // Para el código de estado 204, no se debe retornar un cuerpo
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error en DELETE:", error);

    // Manejo de errores específicos de Prisma
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Error conocido de Prisma al eliminar el pago." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar el pago." },
      { status: 500 }
    );
  }
}
