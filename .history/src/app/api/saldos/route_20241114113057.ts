import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los saldos de clientes y proveedores
export async function GET(request: NextRequest) {
  try {
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        razonSocial: true,
        saldo: true,
      },
    });

    const proveedores = await prisma.proveedor.findMany({
      select: {
        id: true,
        razonSocial: true,
        saldo: true,
      },
    });

    return NextResponse.json({ clientes, proveedores });
  } catch (error) {
    console.error("Error al obtener saldos:", error);
    return NextResponse.json(
      { error: "Error al obtener saldos" },
      { status: 500 }
    );
  }
}

// Crear o actualizar un saldo para cliente o proveedor
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validación de datos
  if (!body.clienteId && !body.proveedorId) {
    return NextResponse.json(
      { error: "Se debe proporcionar clienteId o proveedorId" },
      { status: 400 }
    );
  }
  if (typeof body.saldo !== "number") {
    return NextResponse.json(
      { error: "Datos inválidos para el saldo" },
      { status: 400 }
    );
  }

  try {
    if (body.clienteId) {
      // Actualizar saldo del cliente
      const cliente = await prisma.cliente.update({
        where: { id: body.clienteId },
        data: {
          saldo:
            body.saldo >= 0
              ? { increment: body.saldo }
              : { decrement: Math.abs(body.saldo) }, // Incrementar o decrementar el saldo
        },
      });
      return NextResponse.json(cliente, { status: 200 });
    }

    if (body.proveedorId) {
      // Actualizar saldo del proveedor
      const proveedor = await prisma.proveedor.update({
        where: { id: body.proveedorId },
        data: {
          saldo:
            body.saldo >= 0
              ? { increment: body.saldo }
              : { decrement: Math.abs(body.saldo) }, // Incrementar o decrementar el saldo
        },
      });
      return NextResponse.json(proveedor, { status: 200 });
    }
  } catch (error) {
    console.error("Error al actualizar saldo:", error);
    return NextResponse.json(
      { error: "Error al actualizar saldo" },
      { status: 500 }
    );
  }
}
