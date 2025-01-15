import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// POST: Crear una nueva venta y actualizar saldo
export async function POST(req: Request) {
  try {
    const { total, clienteId } = await req.json();

    // Validar los campos requeridos
    if (
      typeof total !== "number" ||
      isNaN(total) ||
      typeof clienteId !== "number" ||
      isNaN(clienteId)
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios o están mal formateados" },
        { status: 400 }
      );
    }

    // Verificar que el cliente existe
    const clienteExists = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!clienteExists) {
      return NextResponse.json(
        { error: "El cliente no existe" },
        { status: 404 }
      );
    }

    // Iniciar la transacción
    const nuevaVenta = await prisma.$transaction(async (prisma) => {
      // Crear la venta
      const venta = await prisma.venta.create({
        data: {
          total,
          clienteId,
        },
      });

      // Actualizar saldo del cliente
      const cliente = await prisma.cliente.update({
        where: { id: clienteId },
        data: { saldo: { increment: total } },
      });

      // Registrar el movimiento de cuenta
      await prisma.movimientoCuenta.create({
        data: {
          tipo: "credito",
          monto: total,
          saldo: cliente.saldo,
          clienteId: cliente.id,
          referencia: `Venta ID: ${venta.id}`,
          fecha: new Date(),
        },
      });

      return venta;
    });

    return NextResponse.json(nuevaVenta, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Error conocido:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    } else {
      console.error("Error desconocido al crear la venta:", error);
      return NextResponse.json(
        { error: "Error al crear la venta" },
        { status: 500 }
      );
    }
  }
}

// GET: Obtener todas las ventas con paginación
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const ventas = await prisma.venta.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        cliente: true,
      },
    });

    const totalVentas = await prisma.venta.count();

    return NextResponse.json({
      ventas,
      total: totalVentas,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return NextResponse.json(
      { error: "Error al obtener las ventas" },
      { status: 500 }
    );