i; // src/app/api/compras/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// GET: Obtener una compra por ID, incluyendo detalles del proveedor
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const compraId = Number(params.id);
    if (isNaN(compraId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const compra = await prisma.compra.findUnique({
      where: { id: compraId },
      include: { proveedor: true }, // Incluye detalles del proveedor
    });

    return compra
      ? NextResponse.json(compra)
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
) {
  try {
    const compraId = Number(params.id);
    if (isNaN(compraId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const data = await req.json();

    // Validar que los campos necesarios estén presentes
    if (!data.total || !data.proveedorId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: total y proveedorId" },
        { status: 400 }
      );
    }

    const updatedCompra = await prisma.compra.update({
      where: { id: compraId },
      data,
    });

    return NextResponse.json(updatedCompra);
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
) {
  try {
    const compraId = Number(params.id);
    if (isNaN(compraId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.compra.delete({
      where: { id: compraId },
    });
    return NextResponse.json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la compra:", error);
    return NextResponse.json(
      { error: "Error al eliminar la compra" },
      { status: 500 }
    );
  }
}
