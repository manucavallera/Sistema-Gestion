import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener pagos vinculados a un proveedor específico
export async function GET(
  req: Request,
  { params }: { params: { proveedorId: string } }
) {
  try {
    const proveedorId = Number(params.proveedorId);

    if (isNaN(proveedorId)) {
      return NextResponse.json(
        { error: "ID de proveedor inválido" },
        { status: 400 }
      );
    }

    const pagos = await prisma.pago.findMany({
      where: { proveedorId },
    });

    return NextResponse.json(pagos);
  } catch (error) {
    console.error("Error al obtener los pagos del proveedor:", error);
    return NextResponse.json(
      { error: "Error al obtener los pagos del proveedor" },
      { status: 500 }
    );
  }
}
