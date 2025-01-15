import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener todos los recibos
export async function GET() {
  try {
    const recibos = await prisma.recibo.findMany({
      include: { cliente: true, proveedor: true, movimientos: true },
    });
    return NextResponse.json(recibos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los recibos:", error);
    return NextResponse.json(
      { error: "Error al obtener los recibos" },
      { status: 500 }
    );
  }
}

// Crear un nuevo recibo
export async function POST(request: Request) {
  try {
    const { total, clienteId, proveedorId } = await request.json();

    // Validación de campos obligatorios
    if (total === undefined || isNaN(Number(total)) || Number(total) <= 0) {
      return NextResponse.json(
        {
          error:
            "El campo 'total' es obligatorio y debe ser un número positivo",
        },
        { status: 400 }
      );
    }

    if (clienteId === undefined && proveedorId === undefined) {
      return NextResponse.json(
        { error: "Debe proporcionar un 'clienteId' o un 'proveedorId'" },
        { status: 400 }
      );
    }

    const nuevoRecibo = await prisma.recibo.create({
      data: {
        total: Number(total),
        clienteId: clienteId ? Number(clienteId) : undefined,
        proveedorId: proveedorId ? Number(proveedorId) : undefined,
      },
    });

    return NextResponse.json(nuevoRecibo, { status: 201 });
  } catch (error) {
    console.error("Error al crear el recibo:", error);
    return NextResponse.json(
      { error: "Error al crear el recibo" },
      { status: 500 }
    );
  }
}
