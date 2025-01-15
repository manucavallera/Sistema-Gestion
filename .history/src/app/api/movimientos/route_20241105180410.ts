/// src/app/api/movimientos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Registrar un nuevo movimiento
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validar campos obligatorios
    if (!data.tipo || !data.monto || (!data.clienteId && !data.proveedorId)) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    let nuevoSaldo;

    // Manejo de saldo para cliente
    if (data.clienteId) {
      const cliente = await prisma.cliente.findUnique({
        where: { id: data.clienteId },
      });

      if (!cliente) {
        return NextResponse.json(
          { error: "Cliente no encontrado" },
          { status: 404 }
        );
      }

      nuevoSaldo =
        data.tipo === "credito"
          ? (cliente.saldo ?? 0) + data.monto
          : (cliente.saldo ?? 0) - data.monto;

      // Actualizar el saldo del cliente
      await prisma.cliente.update({
        where: { id: data.clienteId },
        data: { saldo: nuevoSaldo },
      });
    }

    // Manejo de saldo para proveedor
    if (data.proveedorId) {
      const proveedor = await prisma.proveedor.findUnique({
        where: { id: data.proveedorId },
      });

      if (!proveedor) {
        return NextResponse.json(
          { error: "Proveedor no encontrado" },
          { status: 404 }
        );
      }

      nuevoSaldo =
        data.tipo === "debito"
          ? (proveedor.saldo ?? 0) + data.monto
          : (proveedor.saldo ?? 0) - data.monto;

      // Actualizar el saldo del proveedor
      await prisma.proveedor.update({
        where: { id: data.proveedorId },
        data: { saldo: nuevoSaldo },
      });
    }

    // Crear el nuevo movimiento en la base de datos
    const nuevoMovimiento = await prisma.movimientoCuenta.create({
      data: {
        tipo: data.tipo,
        monto: data.monto,
        saldo: nuevoSaldo,
        clienteId: data.clienteId,
        proveedorId: data.proveedorId,
        referencia: data.referencia,
      },
    });

    return NextResponse.json(nuevoMovimiento, { status: 201 });
  } catch (error) {
    console.error("Error al registrar el movimiento:", error);
    return NextResponse.json(
      { error: "Error al registrar el movimiento" },
      { status: 500 }
    );
  }
}
