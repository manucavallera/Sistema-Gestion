import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Decimal from "decimal.js"; // Importar Decimal desde decimal.js

// Definición de los tipos de pago
type MetodoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "CHEQUE";
type EstadoPago = "PENDIENTE" | "COMPLETADO" | "CANCELADO";

interface CompraData {
  total: number; // Se espera que 'total' sea un número
  metodoPago: MetodoPago;
  estado: EstadoPago;
  proveedorId: string; // ID del proveedor como string
  fecha: string; // Fecha como string
}

export async function GET() {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        proveedor: true,
      },
    });
    return NextResponse.json(compras);
  } catch (error) {
    console.error("Error al obtener las compras:", error);
 return NextResponse.json(
      {
        message: "Error al obtener las compras",
        error: (error as Error).message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const data: CompraData = await request.json();
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

  // Convertir proveedorId a número
  const proveedorId = parseInt(data.proveedorId, 10);
  if (isNaN(proveedorId)) {
    return NextResponse.json(
      { message: "El ID del proveedor debe ser un número válido" },
      { status: 400 }
    );
  }

  // Buscar el proveedor por ID
  const proveedor = await prisma.proveedor.findUnique({
    where: {
      id: proveedorId,
    },
  });

  if (!proveedor) {
    console.error("Proveedor no encontrado:", proveedorId);
    return NextResponse.json(
      { message: "Proveedor no encontrado" },
      { status: 404 }
    );
  }

  // Asegúrate de que la fecha se interprete correctamente
  const fecha = new Date(data.fecha);
  if (isNaN(fecha.getTime())) {
    return NextResponse.json({ message: "Fecha inválida" }, { status: 400 });
  }

  // Validar que el saldo del proveedor sea suficiente para "COMPLETADO" o "CANCELADO"
  if ((data.estado === "COMPLETADO" || data.estado === "CANCELADO") && proveedor.saldo < data.total) {
    return NextResponse.json(
      { message: "El saldo del proveedor es insuficiente" },
      { status: 400 }
    );
  }

  try {
    // Crear la nueva compra
    const nuevaCompra = await prisma.compra.create({
      data: {
        fecha: fecha,
        total: new Decimal(data.total).toString(), // Convertir a Decimal y luego a string para Prisma
        proveedorId: proveedorId,
        metodoPago: data.metodoPago,
        estado: data.estado,
      },
      include: {
        proveedor: true,
      },
    });

    console.log("Compra creada:", nuevaCompra); // Para depuración

    // Actualizar el saldo del proveedor según el estado
    await actualizarSaldoProveedor(proveedorId, data.total, data.estado);

    // Respuesta final
    return NextResponse.json({
      compra: nuevaCompra,
      mensaje: "Compra registrada correctamente.",
    });
  } catch (error) {
    console.error("Error al crear la compra:", error); // Para depuración
    const errorMessage = (error as Error).message || "Error desconocido"; // Manejo del error
    return NextResponse.json(
      { message: "Error al crear la compra", error: errorMessage },
      { status: 500 }
    );
  }
}

async function actualizarSaldoProveedor(
  proveedorId: number,
  total: number,
  estado: EstadoPago
) {
  try {
    const proveedor = await prisma.proveedor.findUnique({
      where: {
        id: proveedorId,
      },
    });

    if (!proveedor) {
      throw new Error("Proveedor no encontrado");
    }

    let nuevoSaldo = new Decimal(proveedor.saldo); // Asegúrate de que el saldo sea un Decimal

    // Convertir total a Decimal antes de realizar la operación
    const totalDecimal = new Decimal(total);

    // Restar el total del saldo en ambos estados
    if (estado === "COMPLETADO" || estado === "CANCELADO") {
      nuevoSaldo = nuevoSaldo.sub(totalDecimal); // Restar saldo si el pago está completado o cancelado
    }

    await prisma.proveedor.update({
      where: {
        id: proveedorId,
      data: {
        saldo: nuevoSaldo.toString(), // Convertir a string para Prisma
      },
    });

    console.log(
      `Saldo del proveedor ${proveedorId} actualizado a ${nuevoSaldo}`
    );
  } catch (error) {
    console.error("Error al actualizar el saldo del proveedor:", error);
    throw new Error("Error al actualizar el saldo del proveedor");
  }
}