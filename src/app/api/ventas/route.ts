import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Decimal from "decimal.js"; // Importar Decimal desde decimal.js

// Definición de los tipos de pago
type MetodoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "CHEQUE";
type EstadoPago = "PENDIENTE" | "COMPLETADO" | "CANCELADO";

interface VentaData {
  total: number; // Se espera que 'total' sea un número
  metodoPago: MetodoPago;
  estado: EstadoPago;
  clienteId: string; // ID del cliente como string
  fecha: string; // Fecha como string
}

export async function GET() {
  try {
    const ventas = await prisma.venta.findMany({
      include: {
        cliente: true,
      },
    });
    return NextResponse.json(ventas);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return NextResponse.json(
      {
        message: "Error al obtener las ventas",
        error: (error as Error).message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const data: VentaData = await request.json();
  console.log("Datos recibidos:", data); // Para depuración

  // Validaciones
  if (data.total <= 0) {
    return NextResponse.json(
      { message: "El total debe ser un número positivo" },
      { status: 400 }
    );
  }

  const metodosPermitidos: MetodoPago[] = [
    "EFECTIVO",
    "TARJETA",
    "TRANSFERENCIA",
    "CHEQUE",
  ];
  if (!metodosPermitidos.includes(data.metodoPago)) {
    return NextResponse.json(
      { message: "Método de pago no válido" },
      { status: 400 }
    );
  }

  const estadosPermitidos: EstadoPago[] = [
    "PENDIENTE",
    "COMPLETADO",
    "CANCELADO",
  ];
  if (!estadosPermitidos.includes(data.estado)) {
    return NextResponse.json({ message: "Estado no válido" }, { status: 400 });
  }

  // Convertir clienteId a número
  const clienteId = parseInt(data.clienteId, 10);
  if (isNaN(clienteId)) {
    return NextResponse.json(
      { message: "El ID del cliente debe ser un número válido" },
      { status: 400 }
    );
  }

  // Buscar el cliente por ID
  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
  });

  if (!cliente) {
    console.error("Cliente no encontrado:", clienteId);
    return NextResponse.json(
      { message: "Cliente no encontrado" },
      { status: 404 }
    );
  }

  // Asegúrate de que la fecha se interprete correctamente
  const fecha = new Date(data.fecha);
  if (isNaN(fecha.getTime())) {
    return NextResponse.json({ message: "Fecha inválida" }, { status: 400 });
  }

  try {
    // Crear la nueva venta
    const nuevaVenta = await prisma.venta.create({
      data: {
        fecha: fecha,
        total: new Decimal(data.total).toString(), // Convertir a Decimal y luego a string para Prisma
        clienteId: clienteId, // Asegúrate de usar el ID del cliente
        metodoPago: data.metodoPago,
        estado: data.estado,
      },
      include: {
        cliente: true, // Incluir el cliente en la respuesta
      },
    });

    console.log("Venta creada:", nuevaVenta); // Para depuración

    // Respuesta final
    return NextResponse.json(
      {
        venta: nuevaVenta,
        mensaje: "Venta registrada correctamente.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear la venta:", error); // Para depuración
    return NextResponse.json(
      {
        message: "Error al crear la venta",
        error: (error as Error).message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}
