// src/app/api/compras/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Crear una nueva compra y actualizar saldo del proveedor
export async function POST(req: Request) {
  try {
    const { total, proveedorId } = await req.json();

    // Validar los campos requeridos
    if (
      typeof total !== "number" ||
      isNaN(total) ||
      typeof proveedorId !== "number" ||
      isNaN(proveedorId)
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios o están mal formateados" },
        { status: 400 }
      );
    }

    // Iniciar la transacción
    const nuevaCompra = await prisma.$transaction(async (prisma) => {
      // Crear la compra
      const compra = await prisma.compra.create({
        data: {
          total,
          proveedorId,
        },
      });

      // Actualizar saldo del proveedor
      const proveedor = await prisma.proveedor.update({
        where: { id: proveedorId },
        data: { saldo: { decrement: total } },
      });

      // Registrar el movimiento de cuenta
      await prisma.movimientoCuenta.create({
        data: {
          tipo: "debito",
          monto: total,
          saldo: proveedor.saldo,
          proveedorId: proveedor.id,
          referencia: `Compra ID: ${compra.id}`,
        },
      });

      return compra;
    });

    return NextResponse.json(nuevaCompra, { status: 201 });
  } catch (error) {
    console.error("Error al crear la compra:", error);
    return NextResponse.json(
      { error: "Error al crear la compra" },
      { status: 500 }
    );
  }
}
