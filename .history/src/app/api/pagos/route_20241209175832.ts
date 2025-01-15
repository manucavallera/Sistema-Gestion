import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pagos = await prisma.pago.findMany({
      include: {
        movimiento: {
          include: {
            proveedor: true,
            cliente: true,
          },
        },
      },
    });

    const pagosConDetalles = pagos.map((pago) => ({
      id: pago.id,
      monto: pago.monto,
      movimientoId: pago.movimientoId,
      metodoPago: pago.metodoPago,
      montoMovimiento: pago.movimiento?.monto ?? null,
      razonSocial:
        pago.movimiento?.proveedor?.razonSocial ||
        pago.movimiento?.cliente?.razonSocial ||
        "No disponible",
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

// Nuevo endpoint para obtener la lista de cheques
export async function GET_CHEQUES() {
  try {
    const cheques = await prisma.cheque.findMany({
      where: { utilizado: false }, // Filtrar cheques disponibles
    });

    return NextResponse.json(cheques, { status: 200 });
  } catch (error) {
    console.error("Error al obtener cheques:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista de cheques." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { monto, movimientoId, metodoPago, chequeId } = body; // Agregar chequeId

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

    const movimiento = await prisma.movimientoCuenta.findUnique({
      where: { id: movimientoId },
      include: {
        cliente: true,
        proveedor: true, // Incluir proveedor
      },
    });

    if (!movimiento) {
      return NextResponse.json(
        { error: "El movimientoId proporcionado no existe." },
        { status: 404 }
      );
    }

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

    // Si el método de pago es CHEQUE, verificar que el cheque sea válido
    if (metodoPago === "CHEQUE") {
      const cheque = await prisma.cheque.findUnique({
        where: { id: chequeId },
      });

      if (!cheque || cheque.utilizado) {
        // Verificar si el cheque ya ha sido utilizado
        return NextResponse.json(
          { error: "Cheque no válido o ya ha sido utilizado." },
          { status: 400 }
        );
      }

      // Actualizar el estado del cheque a "UTILIZADO"
      await prisma.cheque.update({
        where: { id: chequeId },
        data: { utilizado: true }, // Marcar el cheque como utilizado
      });
    }

    const nuevoPago = await prisma.pago.create({
      data: {
        monto,
        movimientoId,
        metodoPago,
      },
    });

    const clienteId = movimiento.clienteId;
    const proveedorId = movimiento.proveedorId; // Obtener el ID del proveedor

    // Manejo del cliente
    if (clienteId) {
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

      // Asegúrate de que los valores sean números
      const debeActual = Number(cliente.debe);
      const haberActual = Number(cliente.haber);

      const nuevoDebeCliente = debeActual - monto;
      const nuevoHaberCliente = haberActual < 0 ? -haberActual : haberActual; // Asegurarse de que el haber sea positivo

      await prisma.cliente.update({
        where: { id: clienteId },
        data: {
          debe: nuevoDebeCliente,
          haber: nuevoHaberCliente,
        },
      });
    }

    // Manejo del proveedor
    if (proveedorId) {
      const proveedor = await prisma.proveedor.findUnique({
        where: { id: proveedorId },
        select: { debe: true, haber: true },
      });

      if (!proveedor) {
        return NextResponse.json(
          { error: "Proveedor no encontrado." },
          { status: 404 }
        );
      }

      // Asegúrate de que los valores sean números
      const debeActualProveedor = Number(proveedor.debe);
      const haberActualProveedor = Number(proveedor.haber);

      const nuevoDebeProveedor = debeActualProveedor - monto;
      const nuevoHaberProveedor =
        haberActualProveedor < 0 ? -haberActualProveedor : haberActualProveedor; // Asegurarse de que el haber sea positivo

      await prisma.proveedor.update({
        where: { id: proveedorId },
        data: {
          debe: nuevoDebeProveedor,
          haber: nuevoHaberProveedor,
        },
      });
    }

    return NextResponse.json(nuevoPago, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago." },
      { status: 500 }
    );
  }
}
