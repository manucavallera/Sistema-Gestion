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

    return compra
      ? NextResponse.json(compra)
      : NextResponse.json({ error: "Compra no encontrada" }, { status: 404 });
  } catch (error) {
    return handleError(error);
  }
}

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
    console.log("Datos recibidos:", data); // Log para depuración
    validateCompraData(data); // Validar datos

    // Asegúrate de que la fecha esté en formato válido
    if (data.fecha) {
      data.fecha = new Date(data.fecha);
      if (isNaN(data.fecha.getTime())) {
        throw new Error("La fecha proporcionada no es válida.");
      }
    }

    const compraAnterior = await prisma.compra.findUnique({
      where: { id: compraId },
    });

    if (!compraAnterior) {
      return NextResponse.json(
        { error: "Compra no encontrada" },
        { status: 404 }
      );
    }

    // Verificar si el proveedor existe antes de actualizar el saldo
    const proveedorExistente = await prisma.proveedor.findUnique({
      where: { id: data.proveedorId },
    });

    if (!proveedorExistente) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar saldo del proveedor si el total ha cambiado
    if (compraAnterior.total !== data.total) {
      const diferencia = data.total - compraAnterior.total;
      console.log("Actualizando saldo del proveedor, diferencia:", diferencia);
      await prisma.proveedor.update({
        where: { id: data.proveedorId },
        data: { saldo: { increment: diferencia } },
      });
    }

    // Actualizar la compra
    const updatedCompra = await prisma.compra.update({
      where: { id: compraId },
      data,
    });

    console.log("Compra actualizada:", updatedCompra); // Log para depuración
    return NextResponse.json(updatedCompra);
  } catch (error) {
    console.error("Error en PUT:", error); // Log para depuración
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
