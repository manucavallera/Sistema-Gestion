import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener pagos vinculados a un cliente específico
export async function GET(
  req: Request,
  { params }: { params: { clienteId: string } }
) {
  try {
    const clienteId = Number(params.clienteId);

    if (isNaN(clienteId)) {
      return NextResponse.json(
        { error: "ID de cliente inválido" },
        { status: 400 }
      );
    }

    const pagos = await prisma.pago.findMany({
      where: { clienteId },
    });

    return NextResponse.json(pagos);
  } catch (error) {
    console.error("Error al obtener los pagos del cliente:", error);
    return NextResponse.json(
      { error: "Error al obtener los pagos del cliente" },
      { status: 500 }
    );
  }
}
