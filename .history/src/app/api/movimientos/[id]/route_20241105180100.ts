// src/app/api/movimientos/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// src/app/api/movimientos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener todos los movimientos de cuenta corriente
export async function GET() {
  try {
    const movimientos = await prisma.movimientoCuenta.findMany();
    return NextResponse.json(movimientos);
  } catch (error) {
    console.error("Error al obtener movimientos de cuenta:", error);
    return NextResponse.json(
      { error: "Error al obtener los movimientos de cuenta" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un movimiento de cuenta por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movimientoId = Number(params.id);
    if (isNaN(movimientoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const data = await req.json();

    // Validar que los campos necesarios estén presentes
    if (!data.tipo || !data.monto || typeof data.clienteId !== "number") {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Obtener el movimiento actual y el cliente asociado para ajustar el saldo
    const movimientoActual = await prisma.movimientoCuenta.findUnique({
      where: { id: movimientoId },
    });

    if (!movimientoActual) {
      return NextResponse.json(
        { error: "Movimiento no encontrado" },
        { status: 404 }
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: data.clienteId },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Calcular el saldo ajustado antes de aplicar los cambios
    const saldoAjustado =
      movimientoActual.tipo === "credito"
        ? (cliente.saldo ?? 0) - movimientoActual.monto
        : (cliente.saldo ?? 0) + movimientoActual.monto;

    // Calcular el nuevo saldo basado en el movimiento actualizado
    const nuevoSaldo =
      data.tipo === "credito"
        ? saldoAjustado + data.monto
        : saldoAjustado - data.monto;

    // Actualizar el movimiento y el saldo del cliente
    const updatedMovimiento = await prisma.movimientoCuenta.update({
      where: { id: movimientoId },
      data: {
        tipo: data.tipo,
        monto: data.monto,
        saldo: nuevoSaldo,
        clienteId: data.clienteId,
        referencia: data.referencia,
      },
    });

    await prisma.cliente.update({
      where: { id: data.clienteId },
      data: { saldo: nuevoSaldo },
    });

    return NextResponse.json(updatedMovimiento);
  } catch (error) {
    console.error("Error al actualizar el movimiento:", error);
    return NextResponse.json(
      { error: "Error al actualizar el movimiento" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un movimiento de cuenta por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movimientoId = Number(params.id);
    if (isNaN(movimientoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Obtener el movimiento antes de eliminarlo para ajustar el saldo
    const movimientoActual = await prisma.movimientoCuenta.findUnique({
      where: { id: movimientoId },
    });

    if (!movimientoActual) {
      return NextResponse.json(
        { error: "Movimiento no encontrado" },
        { status: 404 }
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: movimientoActual.clienteId ?? undefined },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Ajustar el saldo del cliente según el movimiento eliminado
    const nuevoSaldo =
      movimientoActual.tipo === "credito"
        ? (cliente.saldo ?? 0) - movimientoActual.monto
        : (cliente.saldo ?? 0) + movimientoActual.monto;

    // Eliminar el movimiento y actualizar el saldo del cliente
    await prisma.movimientoCuenta.delete({
      where: { id: movimientoId },
    });

    await prisma.cliente.update({
      where: { id: movimientoActual.clienteId ?? undefined },
      data: { saldo: nuevoSaldo },
    });

    return NextResponse.json({ message: "Movimiento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el movimiento:", error);
    return NextResponse.json(
      { error: "Error al eliminar el movimiento" },
      { status: 500 }
    );
  }
}
