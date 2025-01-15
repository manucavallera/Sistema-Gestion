// app/api/compras/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de tener configurada la conexión a Prisma

export async function GET() {
  const compras = await prisma.compra.findMany({
    include: {
      proveedor: true, // Incluye la información del proveedor
    },
  });
  return NextResponse.json(compras);
}

export async function POST(request: Request) {
  const data = await request.json();
  const nuevaCompra = await prisma.compra.create({
    data: {
      fecha: new Date(data.fecha),
      total: data.total,
      proveedorId: data.proveedorId,
    },
  });
  return NextResponse.json(nuevaCompra);
}
