import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "decimal.js";

const prisma = new PrismaClient();

// Función para actualizar el debe y haber de cliente o proveedor
async function actualizarMovimiento(
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
        await actualizarMovimiento(tipo, monto, Number(clienteId), true);
      }
      if (proveedorId) {
        await actualizarMovimiento(tipo, monto, Number(proveedorId), false);
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

    // Si el estado es 'COMPLETADO', actualizar los saldos
    if (body.estado === "COMPLETADO") {
      const { tipo, monto, clienteId, proveedorId } = movimientoExistente;

      if (tipo === "EGRESO") {
        if (proveedorId !== null) {
          // Ajustar el debe del proveedor
          await prisma.proveedor.update({
            where: { id: proveedorId },
            data: {
              saldo: { decrement: monto }, // Disminuir saldo del proveedor
            },
          });
        } else {
          return NextResponse.json(
            {
              error:
                "El movimiento es un egreso, pero no tiene un proveedor asociado.",
            },
            { status: 400 }
          );
        }
      } else if (tipo === "INGRESO") {
        if (clienteId !== null) {
          // Ajustar el haber del cliente
          await prisma.cliente.update({
            where: { id: clienteId },
            data: {
              saldo: { increment: monto }, // Aumentar saldo del cliente
            },
          });
        } else {
          return NextResponse.json(
            {
              error:
                "El movimiento es un ingreso, pero no tiene un cliente asociado.",
            },
            { status: 400 }
          );
        }
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
