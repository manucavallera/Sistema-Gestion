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
        lt: cutoffDate, // Asegúrate de que esta propiedad existe en tu modelo
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
        lt: cutoffDate, // Asegúrate de que esta propiedad existe en tu modelo
      },
      archived: false, // Solo archivar si no está ya archivada
    },
    data: {
      archived: true,
    },
  });
};

// Resto del código permanece igual...
