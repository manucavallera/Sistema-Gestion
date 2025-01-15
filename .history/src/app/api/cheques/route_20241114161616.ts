import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta a tu cliente Prisma sea correcta

// Manejar las solicitudes GET y POST para cheques
export async function GET() {
  try {
    const cheques = await prisma.cheque.findMany({
      where: { deletedAt: null }, // Solo obtener cheques que no han sido eliminados
    });
    return NextResponse.json(cheques);
  } catch (error) {
    console.error("Error al obtener los cheques:", error);
    return NextResponse.json(
      { message: "Error al obtener los cheques", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const nuevoCheque = await prisma.cheque.create({
      data: {
        fecha: new Date(data.fecha), // Asegúrate de que la fecha esté en un formato válido
        monto: data.monto,
        clienteId: data.clienteId, // Opcional
        proveedorId: data.proveedorId, // Opcional
      },
    });
    return NextResponse.json(nuevoCheque);
  } catch (error) {
    console.error("Error al crear el cheque:", error);
    return NextResponse.json(
      { message: "Error al crear el cheque", error: error.message },
      { status: 500 }
    );
  }
}
