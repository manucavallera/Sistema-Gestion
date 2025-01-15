import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de tener la instancia de Prisma configurada

// Obtener un proveedor por ID
export async function GET(req: Request) {
  const { id } = req.query;

  try {
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: Number(id) },
    });
    if (!proveedor) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(proveedor);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el proveedor" },
      { status: 500 }
    );
  }
}

// Actualizar un proveedor
export async function PUT(req: Request) {
  const { id, razonSocial, direccion, cuit, zona, telefono, email, saldo } =
    await req.json();

  try {
    const proveedorActualizado = await prisma.proveedor.update({
      where: { id: Number(id) },
      data: {
        razonSocial,
        direccion,
        cuit,
        zona,
        telefono,
        email,
        saldo,
      },
    });
    return NextResponse.json(proveedorActualizado);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el proveedor" },
      { status: 500 }
    );
  }
}

// Eliminar un proveedor
export async function DELETE(req: Request) {
  const { id } = req.query;

  try {
    await prisma.proveedor.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Proveedor eliminado" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el proveedor" },
      { status: 500 }
    );
  }
}
