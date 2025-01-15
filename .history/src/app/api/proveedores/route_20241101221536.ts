// src/app/api/proveedores/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener todos los proveedores
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

// Crear un nuevo proveedor
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar que los campos requeridos estén presentes
    if (!body.razonSocial || !body.cuit) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: razonSocial y cuit" },
        { status: 400 }
      );
    }

    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        razonSocial: body.razonSocial,
        direccion: body.direccion,
        cuit: body.cuit,
        zona: body.zona,
        telefono: body.telefono || null,
        email: body.email || null,
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
