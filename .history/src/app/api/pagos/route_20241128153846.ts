import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        cliente: true, // Incluir el cliente para poder actualizar su saldo
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
    const debeActual = cliente.debe.toNumber();
    const haberActual = cliente.haber.toNumber();
    
    // Calcular el nuevo haber y el nuevo saldo
    const nuevoHaber = haberActual + monto; // Sumar el monto al haber
    const nuevoSaldo = nuevoHaber - debeActual; // Calcular nuevo saldo

    // Actualizar la cuenta del cliente
    await prisma.cliente.update({
      where: { id: clienteId },
      data: {
        saldo: nuevoSaldo, // Actualizar el saldo
        haber: nuevoHaber, // Actualizar el haber
        // El debe no se modifica aquí, se mantiene como el monto total
      },
    });

    return NextResponse.json(nuevoPago, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: