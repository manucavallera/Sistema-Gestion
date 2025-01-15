import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime"; // Asegúrate de importar Decimal

const prisma = new PrismaClient();

// Función para manejar las solicitudes GET
export async function GET() {
  try {
    const pagos = await prisma.pago.findMany({
      include: {
        movimiento: {
          include: {
            proveedor: true, // Incluir el proveedor
            cliente: true, // Incluir el cliente
          },
        },
      },
    });

    // Mapeamos los pagos para darles la forma deseada
    const pagosConDetalles = pagos.map((pago) => ({
      id: pago.id,
      monto: pago.monto,
      movimientoId: pago.movimientoId,
      metodoPago: pago.metodoPago,
      montoMovimiento: pago.movimiento?.monto ?? null,
      razonSocial:
        pago.movimiento?.proveedor?.razonSocial ||
        pago.movimiento?.cliente?.razonSocial ||
        "No disponible", // Razón social del proveedor o cliente
    }));

    return NextResponse.json(pagosConDetalles, { status: 200 });
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener los pagos." },
      { status: 500 }
    );
  }
}

// Función para manejar las solicitudes POST (pagos)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { monto, movimientoId, metodoPago } = body;

    // Validar que los campos requeridos estén presentes
    if (
      typeof monto !== "number" ||
      monto <= 0 ||
      !movimientoId ||
      !metodoPago
    ) {
      return NextResponse.json(
        {
          error:
            "Datos inválidos. Asegúrate de que monto sea un número positivo, y que movimientoId y metodoPago estén presentes.",
        },
        { status: 400 }
      );
    }

    // Verifica si el movimientoId existe en la base de datos
    const movimiento = await prisma.movimientoCuenta.findUnique({
      where: { id: movimientoId },
      include: {
        cliente: true, // Incluir el cliente para poder actualizar su debe
      },
    });

    if (!movimiento) {
      return NextResponse.json(
        { error: "El movimientoId proporcionado no existe." },
        { status: 404 }
      );
    }

    // Validar que metodoPago sea uno de los valores esperados
    const metodosPagoValidos = [
      "EFECTIVO",
      "TARJETA",
      "TRANSFERENCIA",
      "CHEQUE",
    ];
    if (!metodosPagoValidos.includes(metodoPago)) {
      return NextResponse.json(
        { error: "Método de pago inválido." },
        { status: 400 }
      );
    }

    // Crear el nuevo pago
    const nuevoPago = await prisma.pago.create({
      data: {
        monto,
        movimientoId,
        metodoPago,
      },
    });

    // Obtener el cliente asociado al movimiento
    const clienteId = movimiento.clienteId;
    if (!clienteId) {
      return NextResponse.json(
        { error: "El movimiento no tiene un cliente asociado." },
        { status: 400 }
      );
    }

    // Obtener el debe y haber actuales del cliente
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      select: { debe: true, haber: true },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado." },
        { status: 404 }
      );
    }

    // Convertir debe y haber a number para realizar la suma
    const nuevoHaber = cliente.haber.toNumber() + monto; // Sumar el monto al haber
    const nuevoSaldo = nuevoHaber - cliente.debe.toNumber(); // Calcular nuevo saldo

    // Actualizar la cuenta del cliente
    await prisma.cliente.update({
      where: { id: clienteId },
      data: {
        haber: new Decimal(nuevoHaber), // Actualizar el haber
        saldo: new Decimal(nuevoSaldo), // Actualizar el saldo
      },
    });

    return NextResponse.json(nuevoPago, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago." },
      { status: 500 }
    );
  }
}

// Función para manejar la creación de un movimiento y actualizar el "debe"
export async function crearMovimiento(request: NextRequest) {
  try {
    const body = await request.json();
    const { monto, clienteId } = body;

    // Validar que los campos requeridos estén presentes
    if (typeof monto !== "number" || monto <= 0 || !clienteId) {
      return NextResponse.json(
        {
          error:
            "Datos inválidos. Asegúrate de que monto sea un número positivo y que clienteId esté presente.",
        },
        { status: 400 }
      );
    }

    // Crear el nuevo movimiento
    const nuevoMovimiento = await prisma.movimientoCuenta.create({
      data: {
        monto,
        clienteId,
      },
    });

    // Actualizar el debe del cliente
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      select: { debe: true },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado." },
        { status: 404 }
      );
    }

    const nuevoDebe = cliente.debe.toNumber() + monto; // Sumar el monto al debe

    // Actualizar la cuenta del cliente
    await prisma.cliente.update({
      where: { id: clienteId },
      data: {
        debe: new Decimal(nuevoDebe), // Actualizar el debe
      },
    });

    return NextResponse.json(nuevoMovimiento, { status: 201 });
  } catch (error) {
    console.error("Error en crearMovimiento:", error);
    return NextResponse.json(
      { error: "Error al crear el movimiento." },
      { status: 500 }
    );
  }
}
