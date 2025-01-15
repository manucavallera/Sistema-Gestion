import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según la ubicación de tu instancia de Prisma

// GET: Obtener todas las ventas
export async function GET() {
  const ventas = await prisma.venta.findMany();
  return NextResponse.json(ventas);
}

// POST: Crear una nueva venta
export async function POST(req: Request) {
  const data = await req.json();
  const newVenta = await prisma.venta.create({
    data,
  });
  return NextResponse.json(newVenta);
}
