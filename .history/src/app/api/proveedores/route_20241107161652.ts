// src/app/api/proveedores/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// Definir un tipo para el error de Prisma
interface PrismaError extends Error {
  code?: string; // La propiedad 'code' es opcional
}

// GET: Obtener todos los proveedores
export async function GET() {
  try {
    const proveedores = await prisma.proveedor.findMany();
    return NextResponse.json(proveedores);
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    return NextResponse.json(
      { error: "Error al obtener los proveedores" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo proveedor
export async function POST(req: Request) {
  try {
    const { razonSocial, direccion, cuit, zona, telefono, email } =
      await req.json();

    // Validar los campos requeridos
    if (!razonSocial || !direccion || !cuit || !zona) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si el CUIT ya existe
    const existingProveedor = await prisma.proveedor.findUnique({
      where: { cuit },
    });

    if (existingProveedor) {
      return NextResponse.json(
        { error: "El CUIT ya está en uso." },
        { status: 400 }
      );
    }

    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        razonSocial,
        direccion,
        cuit,
        zona,
        telefono, // Este campo es opcional
        email, // Este campo es opcional
      },
    });

    return NextResponse.json(nuevoProveedor, { status: 201 });
  } catch (error) {
    console.error("Error al crear el proveedor:", error);

    // Verificar si el error es un PrismaError
    const prismaError = error as PrismaError;

    // Manejo específico del error P2002
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: "El CUIT ya está en uso." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear el proveedor" },
      { status: 500 }
    );
  }
}
