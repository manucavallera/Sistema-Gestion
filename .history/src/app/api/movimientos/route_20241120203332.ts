import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los movimientos
export async function GET(request: NextRequest) {
  try {
    const movimientos = await prisma.movimientoCuenta.findMany({
      include: {
        cliente: true, // Incluir datos del cliente si es necesario
        proveedor: true, // Incluir datos del proveedor si es necesario
      },
    });
    return NextResponse.json(movimientos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

// Crear un nuevo movimiento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación de datos
    const { tipo, monto, estado, clienteId, proveedorId, tipoPago } = body;

    if (
      typeof monto !== "number" ||
      monto <= 0 ||
      !["CREDITO", "DEBITO"].includes(tipo) ||
      !["PENDIENTE", "COMPLETADO", "CANCELADO"].includes(estado) ||
      !["EFECTIVO", "TARJETA", "TRANSFERENCIA", "CHEQUE"].includes(tipoPago)
    ) {
      return NextResponse.json(
        {
          error:
            "Datos inválidos: monto debe ser un número positivo, tipo debe ser 'CREDITO' o 'DEBITO', estado debe ser 'PENDIENTE', 'COMPLETADO' o 'CANCELADO', y tipoPago debe ser uno de los métodos de pago válidos.",
        },
        { status: 400 }
      );
    }

    // Crear el nuevo movimiento
    const nuevoMovimiento = await prisma.movimientoCuenta.create({
      data: {
        tipo,
        monto,
        estado,
        tipoPago,
        clienteId: clienteId || null, // Asegurarse de que clienteId sea null si no se proporciona
        proveedorId: proveedorId || null, // Asegurarse de que proveedorId sea null si no se proporciona
      },
    });

    // Actualizar saldo del cliente o proveedor si el estado es COMPLETADO
    if (estado === "COMPLETADO") {
      if (clienteId) {
        const cliente = await prisma.cliente.findUnique({
          where: { id: clienteId },
        });

        if (tipo === "CREDITO") {
          await prisma.cliente.update({
            where: { id: clienteId },
            data: {
              debe: cliente.debe + monto,
              saldo: cliente.saldo - monto,
            },
          });
        } else if (tipo === "DEBITO") {
          await prisma.cliente.update({
            where: { id: clienteId },
            data: {
              haber: cliente.haber + monto,
              saldo: cliente.saldo + monto,
            },
          });
        }
      }

      if (proveedorId) {
        const proveedor = await prisma.proveedor.findUnique({
          where: { id: proveedorId },
        });

        if (tipo === "CREDITO") {
          await prisma.proveedor.update({
            where: { id: proveedorId },
            data: {
              haber: proveedor.haber + monto,
              saldo: proveedor.saldo + monto,
            },
          });
        } else if (tipo === "DEBITO") {
          await prisma.proveedor.update({
            where: { id: proveedorId },
            data: {
              debe: proveedor.debe + monto,
              saldo: proveedor.saldo - monto,
            },
          });
        }
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
