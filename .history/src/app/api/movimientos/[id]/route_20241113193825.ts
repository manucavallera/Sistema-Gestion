import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener un movimiento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const movimiento = await prisma.movimientoCuenta.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!movimiento) {
    return NextResponse.json(
      { error: "Movimiento no encontrado" },
      { status: 404 }
    );
  }
  return NextResponse.json(movimiento);
}

// Actualizar un movimiento específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = await prisma.movimientoCuenta.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!index) {
    return NextResponse.json(
      { error: "Movimiento no encontrado" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();

    // Validación de datos
    if (
      typeof body.monto !== "number" ||
      body.monto <= 0 ||
      !["CREDITO", "DEBITO"].includes(body.tipo)
    ) {
      return NextResponse.json(
        {
          error:
            "Datos inválidos: monto debe ser un número positivo y tipo debe ser 'CREDITO' o 'DEBITO'.",
        },
        { status: 400 }
      );
    }

    // Actualiza el movimiento
    const updatedMovimiento = await prisma.movimientoCuenta.update({
      where: { id: parseInt(params.id) },
      data: { ...body },
    });

    // Actualiza el saldo del cliente o proveedor
    if (body.tipo === "CREDITO" && body.clienteId) {
      await prisma.cliente.update({
        where: { id: body.clienteId },
        data: {
          saldo: {
            increment: body.monto,
          },
        },
      });
    } else if (body.tipo === "DEBITO" && body.proveedorId) {
      await prisma.proveedor.update({
        where: { id: body.proveedorId },
        data: {
          saldo: {
            decrement: body.monto,
          },
        },
      });
    }

    return NextResponse.json(updatedMovimiento);
  } catch (error) {
    console.error(error); // Registro del error para depuración
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
  const movimiento = await prisma.movimientoCuenta.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!movimiento) {
    return NextResponse.json(
      { error: "Movimiento no encontrado" },
      { status: 404 }
    );
  }

  // Elimina el movimiento
  await prisma.movimientoCuenta.delete({
    where: { id: parseInt(params.id) },
  });

  // Actualiza el saldo del cliente o proveedor
  if (movimiento.tipo === "CREDITO" && movimiento.clienteId) {
    await prisma.cliente.update({
      where: { id: movimiento.clienteId },
      data: {
        saldo: {
          decrement: movimiento.monto,
        },
      },
    });
  } else if (movimiento.tipo === "DEBITO" && movimiento.proveedorId) {
    await prisma.proveedor.update({
      where: { id: movimiento.proveedorId },
      data: {
        saldo: {
          increment: movimiento.monto,
        },
      },
    });
  }

  return NextResponse.json({ message: "Movimiento eliminado" });
}
