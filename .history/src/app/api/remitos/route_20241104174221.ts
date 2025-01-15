import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener todos los remitos
export async function GET() {
  try {
    const remitos = await prisma.remito.findMany({
      include: { cliente: true, proveedor: true, movimientos: true }, // Incluye los datos relacionados
    });
    return NextResponse.json(remitos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los remitos" },
      { status: 500 }
    );
  }
}

// Crear un nuevo remito
export async function POST(request: Request) {
  try {
    const { total, clienteId, proveedorId } = await request.json();

    if (!total || (clienteId === undefined && proveedorId === undefined)) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const nuevoRemito = await prisma.remito.create({
      data: {
        total: Number(total),
        clienteId: clienteId !== undefined ? Number(clienteId) : undefined,
        proveedorId:
          proveedorId !== undefined ? Number(proveedorId) : undefined,
      },
    });

    return NextResponse.json(nuevoRemito, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el remito" },
      { status: 500 }
    );
  }
}
