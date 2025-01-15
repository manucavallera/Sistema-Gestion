// src/app/api/movimientos/cliente/[clienteId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener movimientos de un cliente específico
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

    // Buscar movimientos asociados al cliente
    const movimientos = await prisma.movimientoCuenta.findMany({
      where: { clienteId },
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(movimientos);
  } catch (error) {
    console.error("Error al obtener movimientos del cliente:", error);
    return NextResponse.json(
      { error: "Error al obtener movimientos del cliente" },
      { status: 500 }
    );
  }
}
