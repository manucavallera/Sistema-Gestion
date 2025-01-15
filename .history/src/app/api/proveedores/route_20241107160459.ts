// src/app/api/proveedores/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

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
    const { nombre, direccion, cuit, zona } = await req.json(); // Cambia 'razonSocial' a 'nombre'

    // Validar los campos requeridos
    if (!nombre || !direccion || !cuit || !zona) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        nombre, // Cambia 'razonSocial' a 'nombre'
        direccion,
        cuit,
        zona,
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
