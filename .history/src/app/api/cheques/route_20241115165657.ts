import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta a tu cliente Prisma sea correcta

// Endpoint para crear un cheque
export async function POST(request: Request) {
  const data = await request.json();

  // Validación de datos
  if (!data.fecha || !data.monto || (!data.clienteId && !data.proveedorId)) {
    return NextResponse.json(
      { message: "Todos los campos son obligatorios." },
      { status: 400 }
    );
  }

  const fecha = new Date(data.fecha);
  if (isNaN(fecha.getTime())) {
    return NextResponse.json(
      { message: "La fecha es inválida." },
      { status: 400 }
    );
  }

  if (isNaN(data.monto) || data.monto <= 0) {
    return NextResponse.json(
      { message: "El monto debe ser un número positivo." },
      { status: 400 }
    );
  }

  try {
    // Buscar cliente por ID si se proporciona
    let cliente = null;
    if (data.clienteId) {
      cliente = await prisma.cliente.findUnique({
        where: { id: data.clienteId },
      });
    }

    // Buscar proveedor por ID si se proporciona
    let proveedor = null;
    if (data.proveedorId) {
      proveedor = await prisma.proveedor.findUnique({
        where: { id: data.proveedorId },
      });
    }

    if (!cliente && !proveedor) {
      return NextResponse.json(
        { message: "Cliente o proveedor no encontrado." },
        { status: 404 }
      );
    }

    // Crear el cheque
    const nuevoCheque = await prisma.$transaction(async (prisma) => {
      const cheque = await prisma.cheque.create({
        data: {
          fecha: fecha,
          monto: data.monto,
          clienteId: cliente ? cliente.id : null,
          proveedorId: proveedor ? proveedor.id : null,
          deletedAt: null,
        },
      });

      // Actualizar el saldo del cliente si existe
      if (cliente) {
        await prisma.cliente.update({
          where: { id: cliente.id },
          data: { saldo: cliente.saldo + data.monto },
        });
      }

      // Actualizar el saldo del proveedor si existe
      if (proveedor) {
        await prisma.proveedor.update({
          where: { id: proveedor.id },
          data: { saldo: proveedor.saldo + data.monto },
        });
      }

      return cheque;
    });

    return NextResponse.json(nuevoCheque, { status: 201 });
  } catch (error) {
    console.error("Error al crear el cheque:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { message: "Error al crear el cheque", error: errorMessage },
      { status: 500 }
    );
  }
}

// Endpoint para obtener los cheques
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clienteId = searchParams.get("clienteId");
  const proveedorId = searchParams.get("proveedorId");

  try {
    const cheques = await prisma.cheque.findMany({
      where: {
        ...(clienteId && { clienteId: Number(clienteId) }),
        ...(proveedorId && { proveedorId: Number(proveedorId) }),
      },
      include: {
        cliente: true, // Incluir información del cliente
        proveedor: true, // Incluir información del proveedor
      },
      orderBy: {
        fecha: "desc", // Ordenar por fecha descendente
      },
    });

    return NextResponse.json(cheques, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los cheques:", error);
    return NextResponse.json(
      { message: "Error al obtener los cheques" },
      { status: 500 }
    );
  }
}
