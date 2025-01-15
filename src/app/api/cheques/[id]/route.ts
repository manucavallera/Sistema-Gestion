import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta a tu cliente Prisma sea correcta

// Obtener un cheque específico por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const cheque = await prisma.cheque.findUnique({
      where: { id: Number(id), deletedAt: null }, // Asegúrate de que el cheque no esté eliminado
    });

    if (!cheque) {
      return NextResponse.json(
        { message: "Cheque no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(cheque);
  } catch (error) {
    console.error("Error al obtener el cheque:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { message: "Error al obtener el cheque", error: errorMessage },
      { status: 500 }
    );
  }
}

// Actualizar un cheque específico por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await request.json();

  try {
    // Verificar si el cheque está eliminado
    const chequeExistente = await prisma.cheque.findUnique({
      where: { id: Number(id) },
    });

    if (!chequeExistente || chequeExistente.deletedAt) {
      return NextResponse.json(
        { message: "Cheque no encontrado o eliminado" },
        { status: 404 }
      );
    }

    const cheque = await prisma.cheque.update({
      where: { id: Number(id) },
      data: {
        banco: data.banco || chequeExistente.banco, // Mantener el valor existente si no se proporciona
        sucursal: data.sucursal || chequeExistente.sucursal,
        numero: data.numero || chequeExistente.numero,
        monto: data.monto !== undefined ? data.monto : chequeExistente.monto, // Solo actualizar si se proporciona
        fechaEmision: data.fechaEmision
          ? new Date(data.fechaEmision)
          : chequeExistente.fechaEmision,
        fechaVencimiento: data.fechaVencimiento
          ? new Date(data.fechaVencimiento)
          : chequeExistente.fechaVencimiento,
        clienteId:
          data.clienteId !== undefined
            ? data.clienteId
            : chequeExistente.clienteId,
        proveedorId:
          data.proveedorId !== undefined
            ? data.proveedorId
            : chequeExistente.proveedorId,
        utilizado:
          data.utilizado !== undefined
            ? data.utilizado
            : chequeExistente.utilizado,
      },
    });

    return NextResponse.json(cheque);
  } catch (error) {
    console.error("Error al actualizar el cheque:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { message: "Error al actualizar el cheque", error: errorMessage },
      { status: 500 }
    );
  }
}

// Eliminar un cheque específico por ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Verificar si el cheque existe
    const chequeExistente = await prisma.cheque.findUnique({
      where: { id: Number(id) },
    });

    if (!chequeExistente) {
      return NextResponse.json(
        { message: "Cheque no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el cheque de la base de datos
    await prisma.cheque.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      message: "Cheque eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar el cheque:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { message: "Error al eliminar el cheque", error: errorMessage },
      { status: 500 }
    );
  }
}
