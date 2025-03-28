import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "decimal.js"; // Importar Decimal para manejar montos

const prisma = new PrismaClient();

// Obtener todos los movimientos
export async function GET(request: NextRequest) {
  try {
    const movimientos = await prisma.movimientoCuenta.findMany({
      include: {
        cliente: true,
        proveedor: true,
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

    // Validar que el monto sea un número positivo y que los demás campos tengan valores válidos
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

    // Crear el nuevo movimiento, asegurando que el monto sea un Decimal
    const nuevoMovimiento = await prisma.movimientoCuenta.create({
      data: {
        tipo,
        monto: new Decimal(monto), // Convertir a Decimal
        estado,
        tipoPago,
        clienteId: clienteId ? Number(clienteId) : null, // Convertir a número o null
        proveedorId: proveedorId ? Number(proveedorId) : null, // Convertir a número o null
      },
    });

    // Actualizar saldo del cliente o proveedor si el estado es COMPLETADO
    if (estado === "COMPLETADO") {
      if (clienteId) {
        const cliente = await prisma.cliente.findUnique({
          where: { id: Number(clienteId) }, // Asegurarse de que sea un número
        });

        if (!cliente) {
          return NextResponse.json(
            { error: "Cliente no encontrado." },
            { status: 404 }
          );
        }

        if (tipo === "CREDITO") {
          await prisma.cliente.update({
            where: { id: clienteId },
            data: {
              debe: new Decimal(cliente.debe).plus(monto),
              saldo: new Decimal(cliente.saldo).minus(monto),
            },
          });
        } else if (tipo === "DEBITO") {
          await prisma.cliente.update({
            where: { id: clienteId },
            data: {
              haber: new Decimal(cliente.haber).plus(monto),
              saldo: new Decimal(cliente.saldo).plus(monto),
            },
          });
        }
      }

      if (proveedorId) {
        const proveedor = await prisma.proveedor.findUnique({
          where: { id: Number(proveedorId) }, // Asegurarse de que sea un número
        });

        if (!proveedor) {
          return NextResponse.json(
            { error: "Proveedor no encontrado." },
            { status: 404 }
          );
        }

        if (tipo === "CREDITO") {
          await prisma.proveedor.update({
            where: { id: proveedorId },
            data: {
              haber: new Decimal(proveedor.haber).plus(monto),
              saldo: new Decimal(proveedor.saldo).plus(monto),
            },
          });
        } else if (tipo === "DEBITO") {
          await prisma.proveedor.update({
            where: { id: proveedorId },
            data: {
              debe: new Decimal(proveedor.debe).plus(monto),
              saldo: new Decimal(proveedor.saldo).minus(monto),
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

// Actualizar un movimiento existente
export async function PATCH(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.pathname.split("/").pop()); // Obtener el ID de la URL
    const body = await request.json();

    // Validación de datos
    const { estado } = body;

    // Verificar que el movimiento existe
    const movimientoExistente = await prisma.movimientoCuenta.findUnique({
      where: { id: id },
    });

    if (!movimientoExistente) {
      return NextResponse.json(
        { error: "Movimiento no encontrado." },
        { status: 404 }
      );
    }

    // Validar que el nuevo estado sea uno de los permitidos
    if (!["PENDIENTE", "COMPLETADO", "CANCELADO"].includes(estado)) {
      return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
    }

    // Actualizar el movimiento
    const movimientoActualizado = await prisma.movimientoCuenta.update({
      where: { id: id },
      data: {
        estado: estado, // Cambiar el estado
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
