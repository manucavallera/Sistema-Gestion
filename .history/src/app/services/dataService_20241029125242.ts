// src/app/services/dataService.ts
import { prisma } from "../lib/prisma"; // Asegúrate de que la ruta al cliente Prisma sea correcta

export const archiveOldData = async () => {
  // Obtener la fecha actual y restar un mes para archivar datos más antiguos
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
    },
    data: {
      archived: true, // Asegúrate de que tu modelo de compra tenga un campo `archived`
    },
  });

  // Archivar ventas más antiguas
  await prisma.venta.updateMany({
    where: {
      fecha: {
        lt: oneMonthAgo,
      },
    },
    data: {
      archived: true, // Asegúrate de que tu modelo de venta tenga un campo `archived`
    },
  });
};
