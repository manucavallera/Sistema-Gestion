import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener un proveedor por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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
    console.error("Error al obtener el proveedor:", error);
    return NextResponse.json(
      { error: "Error al obtener el proveedor" },
      { status: 500 }
    );
  }
}

// Actualizar un proveedor
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { razonSocial, direccion, cuit, zona, telefono, email, saldo } =
    await req.json();

  // Validación de datos
  if (!razonSocial || !direccion || !cuit) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

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
    console.error("Error al actualizar el proveedor:", error);
    return NextResponse.json(
      { error: "Error al actualizar el proveedor" },
      { status: 500 }
    );
  }
}

// Eliminar un proveedor
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.proveedor.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Proveedor eliminado" });
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);
    return NextResponse.json(
      { error: "Error al eliminar el proveedor" },
      { status: 500 }
    );
  }
}
