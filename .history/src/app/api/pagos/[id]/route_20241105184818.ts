import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener un pago específico por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pagoId = Number(params.id);
    const pago = await prisma.pago.findUnique({
      where: { id: pagoId },
    });

    if (!pago) {
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(pago);
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    return NextResponse.json(
      { error: "Error al obtener el pago" },
      { status: 500 }
    );
  }
}
