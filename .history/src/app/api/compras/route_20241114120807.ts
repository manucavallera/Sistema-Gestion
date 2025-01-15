import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
  const data = await request.json();
  console.log("Datos recibidos:", data); // Para depuración

  // Validaciones
  if (data.total <= 0) {
    return NextResponse.json(
      { message: "El total debe ser un número positivo" },
      { status: 400 }
    );
  }

  const metodosPermitidos = ["EFECTIVO", "TARJETA", "TRANSFERENCIA", "CHEQUE"];
  if (!metodosPermitidos.includes(data.metodoPago)) {
    return NextResponse.json(
      { message: "Método de pago no válido" },
      { status: 400 }
    );
  }

  // Buscar el proveedor por ID o razón social
  const proveedor = await prisma.proveedor.findFirst({
    where: {
      OR: [
        { id: data.proveedorId },
        { razonSocial: data.razonSocial }, // Asegúrate de que `razonSocial` esté en el body de la solicitud
      ],
    },
  });

  if (!proveedor) {
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
        proveedorId: proveedor.id,
        metodoPago: data.metodoPago,
        estado: data.estado,
      },
      include: {
        proveedor: true,
      },
    });

    console.log("Compra creada:", nuevaCompra); // Para depuración

    // Actualizar el saldo del proveedor según el estado
    if (data.estado === "Por Pagar") {
      await prisma.proveedor.update({
        where: { id: proveedor.id },
        data: {
          saldo: {
            increment: data.total,
          },
        },
      });
    } else if (data.estado === "Pagado") {
      await prisma.proveedor.update({
        where: { id: proveedor.id },
        data: {
          saldo: {
            decrement: data.total,
          },
        },
      });
    }

    return NextResponse.json({
      compra: nuevaCompra,
      mensaje: "Compra registrada correctamente.",
    });
  } catch (error) {
    console.error("Error al crear la compra:", error); // Para depuración
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { message: "Error al crear la compra", error: errorMessage },
      { status: 500 }
    );
  }
}
