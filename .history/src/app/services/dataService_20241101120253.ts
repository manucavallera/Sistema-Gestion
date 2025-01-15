import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Función para archivar compras y ventas más antiguas
export const archiveOldData = async () => {
  const currentDate = new Date();
  const oneMonthAgo = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1)
  );

  // Archivar compras más antiguas
  await prisma.compra.updateMany({
    where: {
      fecha: {
        lt: oneMonthAgo,
      },
      archived: false, // Solo archiva las que aún no estén archivadas
    },
    data: {
      archived: true,
    },
  });

  // Archivar ventas más antiguas
  await prisma.venta.updateMany({
    where: {
      fecha: {
        lt: oneMonthAgo,
      },
      archived: false, // Solo archiva las que aún no estén archivadas
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
