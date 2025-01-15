import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Función para archivar compras y ventas más antiguas
export const archiveOldData = async () => {
  const now = new Date();
  const cutoffDate = new Date(now);
  cutoffDate.setMonth(now.getMonth() - 1); // Cambiado a un mes atrás para pruebas

  await prisma.compra.updateMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
      archived: false,
    },
    data: {
      archived: true,
    },
  });

  await prisma.venta.updateMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
      archived: false,
    },
    data: {
      archived: true,
    },
  });
};

// Función para obtener todas las compras archivadas
export const getArchivedCompras = async () => {
  return await prisma.compra.findMany({
    where: {
      archived: true,
    },
  });
};

// Función para obtener todas las ventas archivadas
export const getArchivedVentas = async () => {
  return await prisma.venta.findMany({
    where: {
      archived: true,
    },
  });
};
