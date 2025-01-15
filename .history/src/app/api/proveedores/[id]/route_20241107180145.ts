// src/app/api/proveedores/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// GET: Obtener un proveedor por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proveedorId = Number(params.id);
    if (isNaN(proveedorId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const proveedor = await prisma.proveedor.findUnique({
      where: { id: proveedorId },
    });

    return proveedor
      ? NextResponse.json(proveedor)
      : NextResponse.json(
          { error: "Proveedor no encontrado" },
          { status: 404 }
        );
  } catch (error) {
    const err = error as Error; // Casting a Error
    console.error("Error al obtener el proveedor:", err.message);
    return NextResponse.json(
      { error: "Error al obtener el proveedor: " + err.message },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un proveedor por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proveedorId = Number(params.id);
    if (isNaN(proveedorId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const data = await req.json();

    // Validar que los campos necesarios estén presentes
    if (!data.razonSocial || !data.direccion || !data.cuit || !data.zona) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const updatedProveedor = await prisma.proveedor.update({
      where: { id: proveedorId },
      data,
    });

    return NextResponse.json(updatedProveedor);
  } catch (error) {
    const err = error as Error; // Casting a Error
    console.error("Error al actualizar el proveedor:", err.message);
    return NextResponse.json(
      { error: "Error al actualizar el proveedor: " + err.message },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un proveedor por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proveedorId = Number(params.id);
    if (isNaN(proveedorId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const proveedorExistente = await prisma.proveedor.findUnique({
      where: { id: proveedorId },
    });

    if (!proveedorExistente) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    await prisma.proveedor.delete({
      where: { id: proveedorId },
    });
    return NextResponse.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    const err = error as Error; // Casting a Error
    console.error("Error al eliminar el proveedor:", err.message);
    return NextResponse.json(
      { error: "Error al eliminar el proveedor: " + err.message },
      { status: 500 }
    );
  }
}
