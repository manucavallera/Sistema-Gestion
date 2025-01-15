import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Registrar una nueva venta y actualizar el saldo
export async function POST(req: Request) {
  try {
    const { total, clienteId } = await req.json();

    // Validar que los datos estén completos
    if (typeof total !== "number" || typeof clienteId !== "number") {
      return NextResponse.json(
        { error: "Faltan campos obligatorios o están mal formateados" },
        { status: 400 }
      );
    }

    // Crear la venta
    const venta = await prisma.venta.create({
      data: {
        total,
        clienteId,
      },
    });

    // Actualizar el saldo del cliente
    const cliente = await prisma.cliente.update({
      where: { id: clienteId },
      data: {
        saldo: {
          increment: total, // Aumenta el saldo del cliente
        },
      },
    });

    // Registrar el movimiento en la cuenta
    await prisma.movimientoCuenta.create({
      data: {
        tipo: "credito",
        monto: total,
        saldo: cliente.saldo,
        clienteId,
        referencia: `Venta ID: ${venta.id}`,
      },
    });

    return NextResponse.json(venta, { status: 201 });
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    return NextResponse.json(
      { error: "Error al registrar la venta" },
      { status: 500 }
    );
  }
}
