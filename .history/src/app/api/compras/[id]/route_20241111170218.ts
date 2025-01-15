// src/app/api/compras/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// Función para manejar errores
const handleError = (error: any) => {
  console.error("Error:", error);
  return NextResponse.json(
    { error: error.message || "Error interno del servidor" },
    { status: 500 }
  );
};

// Función para validar los datos de la compra
const validateCompraData = (data: any) => {
  if (typeof data.total !== "number" || isNaN(data.total)) {
    throw new Error("El total debe ser un número válido.");
  }
  if (typeof data.proveedorId !== "number" || isNaN(data.proveedorId)) {
    throw new Error("El ID del proveedor debe ser un número válido.");
  }
};

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
      include: { proveedor: true },
    });

    if (!compra) {
      return NextResponse.json(
        { error: "Compra no encontrada" },
        { status: 404 }
      );
    }

    // Crear un nuevo objeto que incluya la razón social del proveedor
    const response = {
      id: compra.id,
      total: compra.total,
      fecha: compra.fecha,
      proveedor: {
        razonSocial: compra.proveedor.razonSocial, // Cambiar ID por razón social
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
}

// Resto del código (PUT, DELETE) permanece igual...
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

    const compra = await prisma.compra.findUnique({
      where: { id: compraId },
    });

    if (!compra) {
      return NextResponse.json(
        { error: "Compra no encontrada" },
        { status: 404 }
      );
    }

    await prisma.compra.delete({
      where: { id: compraId },
    });

    return NextResponse.json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    return handleError(error);
  }
}
