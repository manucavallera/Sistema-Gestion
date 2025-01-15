import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "decimal.js";

const prisma = new PrismaClient();

// Función para actualizar el saldo de cliente o proveedor
async function actualizarSaldo(
  tipo: "INGRESO" | "EGRESO",
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

    if (tipo === "INGRESO") {
      await prisma.cliente.update({
        where: { id: entidadId },
        data: {
          haber: new Decimal(cliente.haber).plus(monto),
          saldo: new Decimal(cliente.saldo).plus(monto),
        },
      });
    } else if (tipo === "EGRESO") {
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

    if (tipo === "INGRESO") {
      await prisma.proveedor.update({
        where: { id: entidadId },
        data: {
          haber: new Decimal(proveedor.haber).plus(monto),
          saldo: new Decimal(proveedor.saldo).plus(monto),
        },
      });
    } else if (tipo === "EGRESO") {
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
    const { tipo, monto, estado, clienteId, proveedorId, tipoPago } = body;

    if (
      typeof monto !== "number" ||
      monto <= 0 ||
      !["INGRESO", "EGRESO"].includes(tipo) ||
      !["PENDIENTE", "COMPLETADO", "CANCELADO"].includes(estado) ||
      !["EFECTIVO", "TARJETA", "TRANSFERENCIA", "CHEQUE"].includes(tipoPago)
    ) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const nuevoMovimiento = await prisma.movimientoCuenta.create({
      data: {
        tipo,
        monto: new Decimal(monto),
        estado,
        tipoPago,
        clienteId: clienteId ? Number(clienteId) : null,
        proveedorId: proveedorId ? Number(proveedorId) : null,
      },
    });

    if (estado === "COMPLETADO") {
      if (clienteId) {
        await actualizarSaldo(tipo, monto, Number(clienteId), true);
      }
      if (proveedorId) {
        await actualizarSaldo(tipo, monto, Number(proveedorId), false);
      }
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

// Actualizar un movimiento existente
export async function PATCH(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.pathname.split("/").pop());
    const body = await request.json();
    const { estado } = body;

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const movimientoExistente = await prisma.movimientoCuenta.findUnique({
      where: { id: id },
    });

    if (!movimientoExistente) {
      return NextResponse.json(
        { error: "Movimiento no encontrado." },
        { status: 404 }
      );
    }

    if (!["PENDIENTE", "COMPLETADO", "CANCELADO"].includes(estado)) {
      return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
    }

    const movimientoActualizado = await prisma.movimientoCuenta.update({
      where: { id: id },
      data: {
        estado: estado,
      },
    });

    return NextResponse.json(movimientoActualizado, { status: 200 });
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
        cliente: true, // Incluir información del cliente si es necesario
        proveedor: true, // Incluir información del proveedor si es necesario
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
