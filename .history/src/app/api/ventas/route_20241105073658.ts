// src/app/api/ventas/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Crear una nueva venta y actualizar saldo
export async function POST(req: Request) {
  try {
    const { total, clienteId } = await req.json();

    // Validar los campos requeridos
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

    // Iniciar la transacción
    const nuevaVenta = await prisma.$transaction(async (prisma) => {
      // Crear la venta
      const venta = await prisma.venta.create({
        data: {
          total,
          clienteId,
        },
      });

      // Actualizar saldo del cliente
      const cliente = await prisma.cliente.update({
        where: { id: clienteId },
        data: { saldo: { increment: total } },
      });

      // Registrar el movimiento de cuenta
      await prisma.movimientoCuenta.create({
        data: {
          tipo: "credito",
          monto: total,
          saldo: cliente.saldo,
          clienteId: cliente.id,
          referencia: `Venta ID: ${venta.id}`,
        },
      });

      return venta;
    });

    return NextResponse.json(nuevaVenta, { status: 201 });
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return NextResponse.json(
      { error: "Error al crear la venta" },
      { status: 500 }
    );
  }
}
