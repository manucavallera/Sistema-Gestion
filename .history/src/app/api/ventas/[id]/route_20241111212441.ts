import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// GET: Obtener una venta por ID con detalles del cliente
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const venta = await prisma.venta.findUnique({
      where: { id: Number(params.id) }, // Convertir el ID a número
      include: {
        cliente: {
          select: {
            razonSocial: true,
            direccion: true,
            cuit: true,
            telefono: true,
            email: true,
            saldo: true,
          },
        },
      },
    });

    return venta
      ? NextResponse.json(venta) // Devuelve la venta con detalles del cliente
      : NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return NextResponse.json(
      { error: "Error al obtener la venta" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar una venta por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json(); // Obtener los datos de la solicitud

    // Validación de tipos y valores
    if (
      typeof data.total !== "number" ||
      isNaN(data.total) ||
      typeof data.clienteId !== "number" ||
      isNaN(data.clienteId)
    ) {
      return NextResponse.json(
        {
          error:
            "Los campos 'total' y 'clienteId' son obligatorios y deben ser números válidos",
        },
        { status: 400 }
      );
    }

    // Comprobar que la venta existe
    const ventaExistente = await prisma.venta.findUnique({
      where: { id: Number(params.id) },
    });

    if (!ventaExistente) {
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la venta
    const updatedVenta = await prisma.venta.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(updatedVenta); // Devuelve la venta actualizada
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    return NextResponse.json(
      { error: "Error al actualizar la venta" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una venta por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.venta.delete({
      where: { id: Number(params.id) }, // Convertir el ID a número
    });
    return NextResponse.json({ message: "Venta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return NextResponse.json(
      { error: "Error al eliminar la venta" },
      { status: 500 }
    );
  }
}
