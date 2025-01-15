import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ProveedorData {
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono?: string;
  email?: string;
}

const validarDatosProveedor = (data: ProveedorData) => {
  const { razonSocial, direccion, cuit, zona } = data;
  if (!razonSocial || !direccion || !cuit || !zona) {
    return "Faltan datos requeridos";
  }
  return null;
};

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
  const data: ProveedorData = await request.json();
  const error = validarDatosProveedor(data);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        razonSocial: data.razonSocial,
        direccion: data.direccion,
        cuit: data.cuit,
        zona: data.zona,
        telefono: data.telefono || null,
        email: data.email || null,
        // No se incluyen debe, haber y saldo aquí
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
  const data: ProveedorData = await request.json();
  const error = validarDatosProveedor(data);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const proveedorActualizado = await prisma.proveedor.update({
      where: { id: proveedorId },
      data: {
        razonSocial: data.razonSocial,
        direccion: data.direccion,
        cuit: data.cuit,
        zona: data.zona,
        telefono: data.telefono || null,
        email: data.email || null,
        // No se actualizan debe, haber y saldo aquí
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
