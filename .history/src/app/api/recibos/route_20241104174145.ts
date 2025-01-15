import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener todos los recibos
export async function GET() {
  try {
    const recibos = await prisma.recibo.findMany({
      include: { cliente: true, proveedor: true, movimientos: true }, // Incluye los datos relacionados
    });
    return NextResponse.json(recibos, { status: 200 });
  } catch (error) {
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

    if (!total || (clienteId === undefined && proveedorId === undefined)) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const nuevoRecibo = await prisma.recibo.create({
      data: {
        total: Number(total),
        clienteId: clienteId !== undefined ? Number(clienteId) : undefined,
        proveedorId:
          proveedorId !== undefined ? Number(proveedorId) : undefined,
      },
    });

    return NextResponse.json(nuevoRecibo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el recibo" },
      { status: 500 }
    );
  }
}
