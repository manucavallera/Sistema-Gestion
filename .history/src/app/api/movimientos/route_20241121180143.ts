import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "decimal.js"; // Importar Decimal para manejar montos

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

// Obtener todos los clientes
export async function GET_CLIENTES(request: NextRequest) {
  try {
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        razonSocial: true, // Asegúrate de que este campo existe en tu modelo
      },
    });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

// Obtener todos los proveedores
export async function GET_PROVEEDORES(request: NextRequest) {
  try {
    const proveedores = await prisma.proveedor.findMany({
      select: {
        id: true,
        razonSocial: true, // Asegúrate de que este campo existe en tu modelo
      },
    });
    return NextResponse.json(proveedores);
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
          where: { id: proveedorId },
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
    const url = new URL(request.url); // Crear un objeto URL a partir de request.url
    const id = url.searchParams.get("id"); // Obtener el ID desde los parámetros de búsqueda
    const body = await request.json();

    // Validación de datos
    const { estado } = body;

    // Verificar que el movimiento existe
    const movimientoExistente = await prisma.movimientoCuenta.findUnique({
      where: { id: Number(id) },
    });

    if (!movimientoExistente) {
      return NextResponse.json(
        { error: "Movimiento no encontrado." },
        { status: 404 }
      );
    }

    // Validar que solo se puede cambiar el estado de PENDIENTE a COMPLETADO
    if (movimientoExistente.estado !== "PENDIENTE" || estado !== "COMPLETADO") {
      return NextResponse.json(
        { error: "Solo se puede cambiar el estado de PENDIENTE a COMPLETADO." },
        { status: 400 }
      );
    }

    // Actualizar el movimiento
    const movimientoActualizado = await prisma.movimientoCuenta.update({
      where: { id: Number(id) },
      data: {
        estado: estado, // Cambiar el estado a COMPLETADO
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
