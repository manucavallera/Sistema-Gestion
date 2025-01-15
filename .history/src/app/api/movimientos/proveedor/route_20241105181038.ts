// src/app/api/movimientos/proveedor/[proveedorId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener movimientos de un proveedor específico
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

    // Buscar movimientos asociados al proveedor
    const movimientos = await prisma.movimientoCuenta.findMany({
      where: { proveedorId },
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(movimientos);
  } catch (error) {
    console.error("Error al obtener movimientos del proveedor:", error);
    return NextResponse.json(
      { error: "Error al obtener movimientos del proveedor" },
      { status: 500 }
    );
  }
}
