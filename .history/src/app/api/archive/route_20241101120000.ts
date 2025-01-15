import { NextResponse } from "next/server";
import { archiveOldData } from "@/app/services/dataService"; // Ajusta la ruta si es necesario
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Endpoint POST para archivar datos antiguos
export async function POST() {
  try {
    await archiveOldData();
    return NextResponse.json(
      { message: "Datos archivados con éxito." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al archivar datos:", error);
    return NextResponse.json(
      { message: "Error al archivar datos." },
      { status: 500 }
    );
  }
}

// Endpoint GET para recuperar datos archivados
export async function GET() {
  try {
    const comprasArchivadas = await prisma.compra.findMany({
      where: { archived: true },
    });
    const ventasArchivadas = await prisma.venta.findMany({
      where: { archived: true },
    });

    return NextResponse.json(
      { compras: comprasArchivadas, ventas: ventasArchivadas },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener datos archivados:", error);
    return NextResponse.json(
      { message: "Error al obtener datos archivados." },
      { status: 500 }
    );
  }
}
