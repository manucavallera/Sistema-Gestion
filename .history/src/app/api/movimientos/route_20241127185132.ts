import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "decimal.js";

const prisma = new PrismaClient();

// Función para actualizar el debe y haber de cliente o proveedor
async function actualizarMovimiento(
  tipo: "COMPRA" | "VENTA",
  monto: number,
  entidadId: number,
  esCliente: boolean
) {
  if (esCliente) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: entidadId },
    });

    if (!cliente) {
      throw new Error("Cliente no encontrado.");
    }

    if (tipo === "VENTA") {
      // Actualiza el haber y saldo del cliente en caso de venta
      await prisma.cliente.update({
        where: { id: entidadId },
        data: {
          haber: new Decimal(cliente.haber).plus(monto),
          saldo: new Decimal(cliente.saldo).plus(monto),
        },
      });
    } else if (tipo === "COMPRA") {
      // Solo se actualiza el debe en caso de compra
      await prisma.cliente.update({
        where: { id: entidadId },
        data: {
          debe: new Decimal(cliente.debe).plus(monto),
          saldo: new Decimal(cliente.saldo).minus(monto),
        },
      });
    }
  } else {
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: entidadId },
    });

    if (!proveedor) {
      throw new Error("Proveedor no encontrado.");
    }

    if (tipo === "VENTA") {
      // Solo se actualiza el debe del proveedor en caso de venta
      await prisma.proveedor.update({
        where: { id: entidadId },
        data: {
          debe: new Decimal(proveedor.debe).plus(monto), // Se actualiza el debe
          // No se actualiza el haber
        },
      });
    } else if (tipo === "COMPRA") {
      // Actualiza el debe y saldo del proveedor en caso de compra
      await prisma.proveedor.update({
        where: { id: entidadId },
        data: {
          debe: new Decimal(proveedor.debe).plus(monto),
          saldo: new Decimal(proveedor.saldo).minus(monto),
        },
      });
    }
  }
}

// Crear un nuevo movimiento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, monto, clienteId, proveedorId } = body;

    // Validar datos de entrada
    if (
      typeof monto !== "number" ||
      monto <= 0 ||
      !["COMPRA", "VENTA"].includes(tipo)
    ) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const nuevoMovimiento = await prisma.movimientoCuenta.create({
      data: {
        tipo,
        monto: new Decimal(monto),
        clienteId: clienteId ? Number(clienteId) : null,
        proveedorId: proveedorId ? Number(proveedorId) : null,
      },
    });

    // Actualizar el movimiento en cliente o proveedor si es necesario
    if (clienteId) {
      await actualizarMovimiento(tipo, monto, Number(clienteId), true);
    }
    if (proveedorId) {
      await actualizarMovimiento(tipo, monto, Number(proveedorId), false);
    }

    return NextResponse.json(nuevoMovimiento, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

// Obtener movimientos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get("clienteId");
    const proveedorId = searchParams.get("proveedorId");

    const where: any = {};
    if (clienteId) {
      where.clienteId = Number(clienteId);
    }
    if (proveedorId) {
      where.proveedorId = Number(proveedorId);
    }

    const movimientos = await prisma.movimientoCuenta.findMany({
      where,
      include: {
        cliente: true,
        proveedor: true,
      },
    });

    return NextResponse.json(movimientos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
