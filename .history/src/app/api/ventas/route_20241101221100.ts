// src/app/api/ventas/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener todas las ventas, incluyendo los datos del cliente
export async function GET() {
  try {
    const ventas = await prisma.venta.findMany({
      include: {
        cliente: true, // Incluye los datos del cliente en cada venta
      },
    });
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
    const { total, clienteId } = await req.json(); // Recibe los datos del cuerpo de la solicitud

    // Validar los campos requeridos y su tipo
    if (
      typeof total !== "number" ||
      isNaN(total) ||
      typeof clienteId !== "number" ||
      isNaN(clienteId)
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios o están mal formateados" },
        { status: 400 }
      );
    }

    // Crear la nueva venta en la base de datos
    const nuevaVenta = await prisma.venta.create({
      data: {
        total: total,
        clienteId: clienteId, // Asegúrate de que clienteId sea un número
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
