import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener todas las compras
export async function GET() {
  try {
    const compras = await prisma.compra.findMany();
    return NextResponse.json(compras);
  } catch (error) {
    console.error("Error al obtener compras:", error);
    return NextResponse.json(
      { error: "Error al obtener compras" },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva compra
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validar que los campos requeridos estén presentes
    if (!data.total || !data.proveedorId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Crear una nueva compra
    const newCompra = await prisma.compra.create({
      data,
    });
    return NextResponse.json(newCompra);
  } catch (error) {
    console.error("Error al crear una nueva compra:", error);
    return NextResponse.json(
      { error: "Error al crear la compra" },
      { status: 500 }
    );
  }
}
