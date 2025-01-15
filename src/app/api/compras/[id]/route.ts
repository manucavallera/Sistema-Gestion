import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de tener configurada la conexión a Prisma

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const compra = await prisma.compra.findUnique({
    where: { id: Number(params.id) },
    include: {
      proveedor: true, // Incluye la información del proveedor
    },
  });

  if (!compra) {
    return NextResponse.json(
      { message: "Compra no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(compra);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();

  // Buscar el proveedor por ID o razón social
  let proveedorId;

  if (data.proveedorId) {
    proveedorId = data.proveedorId; // Si se pasa el ID del proveedor, usarlo directamente
  } else if (data.razonSocial) {
    const proveedor = await prisma.proveedor.findFirst({
      where: {
        razonSocial: data.razonSocial, // Busca por razón social
      },
    });

    if (!proveedor) {
      return NextResponse.json(
        { message: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    proveedorId = proveedor.id; // Usa el ID del proveedor encontrado
  } else {
    return NextResponse.json(
      { message: "Se requiere proveedorId o razonSocial" },
      { status: 400 }
    );
  }

  // Validaciones adicionales
  if (data.total <= 0) {
    return NextResponse.json(
      { message: "El total debe ser un número positivo" },
      { status: 400 }
    );
  }

  const metodosPermitidos = ["EFECTIVO", "TARJETA", "TRANSFERENCIA", "CHEQUE"];
  if (!metodosPermitidos.includes(data.metodoPago)) {
    return NextResponse.json(
      { message: "Método de pago no válido" },
      { status: 400 }
    );
  }

  try {
    const compraActualizada = await prisma.compra.update({
      where: { id: Number(params.id) },
      data: {
        fecha: new Date(data.fecha),
        total: data.total,
        proveedorId, // Usa el ID del proveedor
        metodoPago: data.metodoPago, // Actualiza el método de pago
      },
      include: {
        proveedor: true, // Incluye la información del proveedor en la respuesta
      },
    });

    return NextResponse.json(compraActualizada);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error al actualizar la compra", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error desconocido al actualizar la compra" },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.compra.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "Compra eliminada" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error al eliminar la compra", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error desconocido al eliminar la compra" },
        { status: 500 }
      );
    }
  }
}
