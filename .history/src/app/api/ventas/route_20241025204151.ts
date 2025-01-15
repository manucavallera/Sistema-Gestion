import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según la ubicación de tu instancia de Prisma

// GET: Obtener todas las ventas
export async function GET() {
  try {
    const ventas = await prisma.venta.findMany();
    return NextResponse.json(ventas);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener las ventas" },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva venta
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validar que los datos requeridos estén presentes
    const { clienteId, total } = data;
    if (!clienteId || !total) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (clienteId, total)" },
        { status: 400 }
      );
    }

    // Crear la nueva venta
    const newVenta = await prisma.venta.create({
      data: {
        clienteId,
        total,
      },
    });

    return NextResponse.json(newVenta, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
