import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener un movimiento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movimiento = await prisma.movimientoCuenta.findUnique({
      where: { id: parseInt(params.id) },
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

    // Verifica si el campo 'estado' está presente
    if (!body.estado) {
      return NextResponse.json(
        { error: "El campo 'estado' es requerido." },
        { status: 400 }
      );
    }

    // Validación de datos para el campo 'estado'
    if (!["PENDIENTE", "COMPLETADO", "CANCELADO"].includes(body.estado)) {
      return NextResponse.json(
        {
          error:
            "El campo 'estado' debe ser 'PENDIENTE', 'COMPLETADO' o 'CANCELADO'.",
        },
        { status: 400 }
      );
    }

    // Obtener el movimiento existente
    const movimientoExistente = await prisma.movimientoCuenta.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        cliente: true, // Incluir cliente para obtener el ID
        proveedor: true, // Incluir proveedor para obtener el ID
      },
    });

    if (!movimientoExistente) {
      return NextResponse.json(
        { error: "Movimiento no encontrado." },
        { status: 404 }
      );
    }

    // Si el estado es 'COMPLETADO', actualizar los saldos
    if (body.estado === "COMPLETADO") {
      const { tipo, monto, clienteId, proveedorId } = movimientoExistente;

      if (tipo === "DEBITO") {
        // Si es un débito, restar del saldo del cliente
        await prisma.cliente.update({
          where: { id: clienteId },
          data: {
            saldo: { decrement: monto },
          },
        });
      } else if (tipo === "CREDITO") {
        // Si es un crédito, sumar al saldo del proveedor
        await prisma.proveedor.update({
          where: { id: proveedorId },
          data: {
            saldo: { increment: monto },
          },
        });
      }
    }

    // Actualiza solo el estado
    const movimientoActualizado = await prisma.movimientoCuenta.update({
      where: { id: parseInt(params.id) },
      data: {
        estado: body.estado, // Actualiza solo el estado
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
