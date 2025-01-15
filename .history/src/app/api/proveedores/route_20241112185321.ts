import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de tener la instancia de Prisma configurada

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
  const { razonSocial, direccion, cuit, zona, telefono, email, saldo } =
    await request.json();

  // Validación de datos
  if (!razonSocial || !direccion || !cuit) {
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
        telefono,
        email,
        saldo: saldo || 0, // Asigna un saldo por defecto si no se proporciona
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
