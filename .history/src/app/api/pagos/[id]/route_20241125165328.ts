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
    console.error(error);
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

    const pagoActualizado = await prisma.pago.update({
      where: { id: Number(id) },
      data: {
        monto,
        estado,
      },
    });

    return NextResponse.json(pagoActualizado, { status: 200 });
  } catch (error) {
    console.error(error);
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
    await prisma.pago.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Pago eliminado." }, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al eliminar el pago." },
      { status: 500 }
    );
  }
}
