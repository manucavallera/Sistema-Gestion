import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener todas las ventas
export async function GET() {
  try {
    const ventas = await prisma.venta.findMany();
    return NextResponse.json(ventas);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
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

    // Validar que los campos necesarios estén presentes
    if (!data.total || !data.clienteId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const nuevaVenta = await prisma.venta.create({
      data,
    });

    return NextResponse.json(nuevaVenta, { status: 201 });
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return NextResponse.json(
      { error: "Error al crear la venta" },
      { status: 500 }
    );
  }
}
