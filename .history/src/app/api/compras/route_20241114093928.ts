// app/api/compras/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const compras = await prisma.compra.findMany({
    include: {
      proveedor: true,
    },
  });
  return NextResponse.json(compras);
}

export async function POST(request: Request) {
  const data = await request.json();

  // Buscar el proveedor por razón social
  const proveedor = await prisma.proveedor.findFirst({
    where: {
      razonSocial: data.razonSocial,
    },
  });

  if (!proveedor) {
    return NextResponse.json(
      { message: "Proveedor no encontrado" },
      { status: 404 }
    );
  }

  // Asegúrate de que la fecha se interprete correctamente
  const fecha = new Date(data.fecha); // Asegúrate de que data.fecha esté en formato ISO

  // Crear la nueva compra
  const nuevaCompra = await prisma.compra.create({
    data: {
      fecha: fecha,
      total: data.total,
      proveedorId: proveedor.id,
      metodoPago: data.metodoPago, // Guarda el método de pago
    },
    include: {
      proveedor: true,
    },
  });

  // Actualizar el saldo del proveedor
  await prisma.proveedor.update({
    where: { id: proveedor.id },
    data: {
      saldo: proveedor.saldo + data.total, // Asumiendo que es un crédito
    },
  });

  return NextResponse.json(nuevaCompra);
}
