// src/app/api/proveedores/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener un proveedor por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: Number(params.id) },
    });

    if (!proveedor) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(proveedor);
  } catch (error) {
    console.error("Error al obtener el proveedor:", error);
    return NextResponse.json(
      { error: "Error al obtener el proveedor" },
      { status: 500 }
    );
  }
}

// Actualizar un proveedor por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validar que al menos un campo relevante esté presente
    if (!body.razonSocial && !body.cuit) {
      return NextResponse.json(
        {
          error: "Se requiere al menos 'razonSocial' o 'cuit' para actualizar.",
        },
        { status: 400 }
      );
    }

    const proveedorActualizado = await prisma.proveedor.update({
      where: { id: Number(params.id) },
      data: {
        razonSocial: body.razonSocial,
        direccion: body.direccion,
        cuit: body.cuit,
        zona: body.zona,
        telefono: body.telefono || null,
        email: body.email || null,
      },
    });

    return NextResponse.json(proveedorActualizado);
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    return NextResponse.json(
      { error: "Error al actualizar el proveedor" },
      { status: 500 }
    );
  }
}

// Eliminar un proveedor por ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.proveedor.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "Proveedor eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);
    return NextResponse.json(
      { error: "Error al eliminar el proveedor" },
      { status: 500 }
    );
  }
}
