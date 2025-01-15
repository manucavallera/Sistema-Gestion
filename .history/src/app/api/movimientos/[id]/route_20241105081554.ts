// src/app/api/movimientos/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// GET: Obtener un movimiento de cuenta por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movimientoId = Number(params.id);
    if (isNaN(movimientoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const movimiento = await prisma.movimientoCuenta.findUnique({
      where: { id: movimientoId },
    });

    return movimiento
      ? NextResponse.json(movimiento)
      : NextResponse.json(
          { error: "Movimiento no encontrado" },
          { status: 404 }
        );
  } catch (error) {
    console.error("Error al obtener el movimiento:", error);
    return NextResponse.json(
      { error: "Error al obtener el movimiento" },
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
    if (!data.tipo || !data.monto || !data.clienteId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Obtener el movimiento actual y el cliente/proveedor asociado para ajustar el saldo
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

    // Revertir el saldo basado en el movimiento actual
    const saldoAjustado =
      movimientoActual.tipo === "credito"
        ? cliente.saldo - movimientoActual.monto
        : cliente.saldo + movimientoActual.monto;

    // Calcular el nuevo saldo con el movimiento actualizado
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
      where: { id: movimientoActual.clienteId },
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
        ? cliente.saldo - movimientoActual.monto
        : cliente.saldo + movimientoActual.monto;

    // Eliminar el movimiento y actualizar el saldo del cliente
    await prisma.movimientoCuenta.delete({
      where: { id: movimientoId },
    });

    await prisma.cliente.update({
      where: { id: movimientoActual.clienteId },
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
