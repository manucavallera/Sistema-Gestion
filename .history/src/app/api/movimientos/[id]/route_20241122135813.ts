import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "decimal.js";

const prisma = new PrismaClient();

// Obtener un movimiento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movimiento = await prisma.movimientoCuenta.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        cliente: true,
        proveedor: true,
      },
    });

    if (!movimiento) {
      return NextResponse.json(
        { error: "Movimiento no encontrado." },
        { status: 404 }
      );
    }
    return NextResponse.json(movimiento);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

// Actualizar un movimiento específico
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { tipo, monto } = body; // Solo obtenemos tipo y monto

    // Obtener el movimiento existente
    const movimientoExistente = await prisma.movimientoCuenta.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        cliente: true,
        proveedor: true,
      },
    });

    if (!movimientoExistente) {
      return NextResponse.json(
        { error: "Movimiento no encontrado." },
        { status: 404 }
      );
    }

    // Actualizar el movimiento según el nuevo tipo y monto
    const movimientoActualizado = await prisma.movimientoCuenta.update({
      where: { id: parseInt(params.id) },
      data: {
        tipo: tipo || movimientoExistente.tipo, // Mantener el tipo existente si no se proporciona uno nuevo
        monto: new Decimal(monto || movimientoExistente.monto), // Mantener el monto existente si no se proporciona uno nuevo
      },
    });

    return NextResponse.json(movimientoActualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

// Eliminar un movimiento específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movimientoExistente = await prisma.movimientoCuenta.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        cliente: true,
        proveedor: true,
      },
    });

    if (!movimientoExistente) {
      return NextResponse.json(
        { error: "Movimiento no encontrado." },
        { status: 404 }
      );
    }

    const { tipo, monto, clienteId, proveedorId } = movimientoExistente;

    // Ajustar saldos antes de eliminar el movimiento
    if (tipo === "COMPRA" && clienteId !== null) {
      await prisma.cliente.update({
        where: { id: clienteId },
        data: {
          saldo: { increment: monto }, // Revertir el saldo
        },
      });
    } else if (tipo === "VENTA" && proveedorId !== null) {
      await prisma.proveedor.update({
        where: { id: proveedorId },
        data: {
          saldo: { decrement: monto }, // Revertir el saldo
        },
      });
    }

    const movimientoEliminado = await prisma.movimientoCuenta.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({
      message: "Movimiento eliminado.",
      movimiento: movimientoEliminado,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Movimiento no encontrado." },
        { status: 404 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
