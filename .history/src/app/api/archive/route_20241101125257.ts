import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Función para archivar datos antiguos
export const archiveOldData = async () => {
  const now = new Date();
  const cutoffDate = new Date(now);
  cutoffDate.setFullYear(now.getFullYear() - 1); // Archivar datos más antiguos que un año

  // Archivar compras
  await prisma.compra.updateMany({
    where: {
      createdAt: {
        lt: cutoffDate, // Ajusta según la propiedad de fecha en tu modelo
      },
      archived: false, // Solo archivar si no está ya archivada
    },
    data: {
      archived: true,
    },
  });

  // Archivar ventas
  await prisma.venta.updateMany({
    where: {
      createdAt: {
        lt: cutoffDate, // Ajusta según la propiedad de fecha en tu modelo
      },
      archived: false, // Solo archivar si no está ya archivada
    },
    data: {
      archived: true,
    },
  });
};

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
