import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// GET: Obtener todas las ventas
export async function GET() {
  try {
    const ventas = await prisma.venta.findMany(); // Obtener todas las ventas
    return NextResponse.json(ventas);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener ventas" },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva venta
export async function POST(req: Request) {
  try {
    const { total, clienteId } = await req.json(); // Recibe los datos del cuerpo de la solicitud

    // Validar los campos requeridos
    if (!total || !clienteId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Crear la nueva venta en la base de datos
    const nuevaVenta = await prisma.venta.create({
      data: {
        total: Number(total),
        clienteId: Number(clienteId), // Asegúrate de que clienteId sea un número
      },
    });

    return NextResponse.json(nuevaVenta);
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return NextResponse.json(
      { error: "Error al crear la venta" },
      { status: 500 }
    );
  }
}
