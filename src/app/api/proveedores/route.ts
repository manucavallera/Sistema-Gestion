import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de tener la instancia de Prisma configurada

interface ProveedorData {
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono?: string;
  email?: string;
  saldo?: number; // Añadir saldo como opcional
  debe?: number; // Añadir debe como opcional
  haber?: number; // Añadir haber como opcional
}

// Obtener todos los proveedores
export async function GET() {
  try {
    const proveedores = await prisma.proveedor.findMany();
    return NextResponse.json(proveedores);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    return NextResponse.json(
      { error: "Error al obtener proveedores" },
      { status: 500 }
    );
  }
}

// Crear un nuevo proveedor
export async function POST(request: Request) {
  const {
    razonSocial,
    direccion,
    cuit,
    zona,
    telefono,
    email,
    saldo,
    debe,
    haber,
  } = await request.json();

  // Validación de datos
  if (!razonSocial || !direccion || !cuit || !zona) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  try {
    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        razonSocial,
        direccion,
        cuit,
        zona,
        telefono: telefono || null,
        email: email || null,
        saldo: saldo || 0, // Asigna un saldo por defecto si no se proporciona
        debe: debe || 0, // Asigna un debe por defecto si no se proporciona
        haber: haber || 0, // Asigna un haber por defecto si no se proporciona
      },
    });
    return NextResponse.json(nuevoProveedor, { status: 201 });
  } catch (error) {
    console.error("Error al crear el proveedor:", error);
    return NextResponse.json(
      { error: "Error al crear el proveedor" },
      { status: 500 }
    );
  }
}

// Actualizar un proveedor existente
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const proveedorId = parseInt(params.id);
  const { razonSocial, direccion, cuit, zona, telefono, email } =
    await request.json();

  // Validación de datos
  if (!razonSocial || !direccion || !cuit || !zona) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  try {
    const proveedorActualizado = await prisma.proveedor.update({
      where: { id: proveedorId },
      data: {
        razonSocial,
        direccion,
        cuit,
        zona,
        telefono: telefono || null,
        email: email || null,
        // No se deben actualizar debe, haber y saldo aquí
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
  request: Request,
  { params }: { params: { id: string } }
) {
  const proveedorId = parseInt(params.id);

  try {
    await prisma.proveedor.delete({
      where: { id: proveedorId },
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
