import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Definición de los tipos de pago
type MetodoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "CHEQUE";
type EstadoPago = "PENDIENTE" | "COMPLETADO" | "CANCELADO";

interface CompraData {
  total: number;
  metodoPago: MetodoPago; // Asegúrate de que esto sea del tipo correcto
  estado: EstadoPago; // Asegúrate de que esto sea del tipo correcto
  proveedorId: string; // Mantén esto como string si lo recibes como tal
  fecha: string;
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
      { message: "Error al obtener las compras", error: error.message },
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
  const proveedorId = parseInt(data.proveedorId, 10); // Asegúrate de que esto sea un número
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

  try {
    // Crear la nueva compra
    const nuevaCompra = await prisma.compra.create({
      data: {
        fecha: fecha,
        total: data.total,
        proveedorId: proveedorId, // Asegúrate de que esto sea un número
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
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"; // Corregido aquí
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
      where: { id: proveedorId },
    });

    if (!proveedor) {
      throw new Error("Proveedor no encontrado");
    }

    let nuevoSaldo: number = proveedor.saldo.toNumber(); // Convertir Decimal a number

    if (estado === "COMPLETADO") {
      nuevoSaldo += total; // Aumentar saldo si la compra está completada
    } else if (estado === "CANCELADO") {
      nuevoSaldo -= total; // Disminuir saldo si la compra está cancelada
    }

    await prisma.proveedor.update({
      where: { id: proveedorId },
      data: { saldo: nuevoSaldo },
    });
  } catch (error) {
    console.error("Error al actualizar el saldo del proveedor:", error);
    throw new Error("Error al actualizar el saldo del proveedor");
  }
}
