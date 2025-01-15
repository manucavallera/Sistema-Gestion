// src/app/api/compras/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// Tipo para la respuesta de la API
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// GET: Obtener una compra por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const compraId = Number(params.id);
    if (isNaN(compraId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const compra = await prisma.compra.findUnique({
      where: { id: compraId },
    });

    return compra
      ? NextResponse.json({ data: compra })
      : NextResponse.json({ error: "Compra no encontrada" }, { status: 404 });
  } catch (error) {
    console.error("Error al obtener la compra:", error);
    return NextResponse.json(
      { error: "Error al obtener la compra" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar una compra por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const compraId = Number(params.id);
    if (isNaN(compraId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const data = await req.json();

    // Validar que los campos necesarios estén presentes
    if (
      typeof data.total !== "number" ||
      data.total <= 0 ||
      !data.proveedorId
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios o son inválidos" },
        { status: 400 }
      );
    }

    // Verificar si la compra existe antes de intentar actualizar
    const compraExistente = await prisma.compra.findUnique({
      where: { id: compraId },
    });

    if (!compraExistente) {
      return NextResponse.json(
        { error: "Compra no encontrada" },
        { status: 404 }
      );
    }

    const updatedCompra = await prisma.compra.update({
      where: { id: compraId },
      data,
    });

    return NextResponse.json({ data: updatedCompra });
  } catch (error) {
    console.error("Error al actualizar la compra:", error);
    return NextResponse.json(
      { error: "Error al actualizar la compra" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una compra por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const compraId = Number(params.id);
    if (isNaN(compraId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const compraExistente = await prisma.compra.findUnique({
      where: { id: compraId },
    });

    if (!compraExistente) {
      return NextResponse.json(
        { error: "Compra no encontrada" },
        { status: 404 }
      );
    }

    await prisma.compra.delete({
      where: { id: compraId },
    });
    return NextResponse.json({
      data: null,
      message: "Compra eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar la compra:", error);
    return NextResponse.json(
      { error: "Error al eliminar la compra" },
      { status: 500 }
    );
  }
}
