import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener todos los remitos
export async function GET() {
  try {
    const remitos = await prisma.remito.findMany({
      include: { cliente: true, proveedor: true, movimientos: true },
    });
    return NextResponse.json(remitos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los remitos:", error);
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

    if (!total || isNaN(Number(total))) {
      return NextResponse.json(
        {
          error: "El campo 'total' es obligatorio y debe ser un número válido",
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

    // Construir los datos de creación según los valores disponibles
    const data: any = { total: Number(total) };

    if (clienteId !== undefined) data.clienteId = Number(clienteId);
    if (proveedorId !== undefined) data.proveedorId = Number(proveedorId);

    const nuevoRemito = await prisma.remito.create({ data });

    return NextResponse.json(nuevoRemito, { status: 201 });
  } catch (error) {
    console.error("Error al crear el remito:", error);
    return NextResponse.json(
      { error: "Error al crear el remito" },
      { status: 500 }
    );
  }
}
