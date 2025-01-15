// src/app/api/compras/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

// Función para manejar errores
const handleError = (error: any) => {
  console.error("Error:", error);
  if (error instanceof PrismaClientKnownRequestError) {
    // Maneja errores específicos de Prisma
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(
    { error: error.message || "Error interno del servidor" },
    { status: 500 }
  );
};

// Función para validar los datos de la compra
const validateCompraData = async (data: any) => {
  if (typeof data.total !== "number" || isNaN(data.total)) {
    throw new Error("El total debe ser un número válido.");
  }
  if (typeof data.proveedorId !== "number" || isNaN(data.proveedorId)) {
    throw new Error("El ID del proveedor debe ser un número válido.");
  }

  // Verificar si el proveedor existe
  const proveedor = await prisma.proveedor.findUnique({
    where: { id: data.proveedorId },
  });
  if (!proveedor) {
    throw new Error("El proveedor no existe.");
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

    return compra
      ? NextResponse.json(compra)
      : NextResponse.json({ error: "Compra no encontrada" }, { status: 404 });
  } catch (error) {
    return handleError(error);
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
    await validateCompraData(data); // Validar datos

    const compraAnterior = await prisma.compra.findUnique({
      where: { id: compraId },
    });

    if (!compraAnterior) {
      return NextResponse.json(
        { error: "Compra no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar compra y saldo del proveedor en una transacción
    const updatedCompra = await prisma.$transaction(async (tx) => {
      const updatedCompra = await tx.compra.update({
        where: { id: compraId },
        data,
      });

      // Actualizar saldo del proveedor si el total ha cambiado
      if (compraAnterior.total !== data.total) {
        await tx.proveedor.update({
          where: { id: data.proveedorId },
          data: { saldo: { increment: compraAnterior.total - data.total } },
        });
      }

      return updatedCompra;
    });

    return NextResponse.json(updatedCompra);
  } catch (error) {
    return handleError(error);
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
