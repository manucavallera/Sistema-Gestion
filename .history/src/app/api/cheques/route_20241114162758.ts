import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta a tu cliente Prisma sea correcta

// Manejar las solicitudes GET y POST para cheques
export async function GET() {
  try {
    const cheques = await prisma.cheque.findMany({
      where: { deletedAt: null },
    });
    console.log("Cheques obtenidos:", cheques); // Log para verificar la salida
    return NextResponse.json(cheques);
  } catch (error) {
    console.error("Error al obtener los cheques:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { message: "Error al obtener los cheques", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  // Validación de datos
  if (!data.fecha || !data.monto || !data.clienteId || !data.proveedorId) {
    return NextResponse.json(
      { message: "Todos los campos son obligatorios." },
      { status: 400 }
    );
  }

  try {
    const nuevoCheque = await prisma.cheque.create({
      data: {
        fecha: new Date(data.fecha),
        monto: data.monto,
        clienteId: data.clienteId,
        proveedorId: data.proveedorId,
      },
    });
    return NextResponse.json(nuevoCheque);
  } catch (error) {
    console.error("Error al crear el cheque:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { message: "Error al crear el cheque", error: errorMessage },
      { status: 500 }
    );
  }
}
