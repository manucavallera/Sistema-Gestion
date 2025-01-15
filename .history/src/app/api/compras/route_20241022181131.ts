import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según la ubicación de tu instancia de Prisma

// GET: Obtener todas las compras
export async function GET() {
  const compras = await prisma.compra.findMany();
  return NextResponse.json(compras);
}

// POST: Crear una nueva compra
export async function POST(req: Request) {
  const data = await req.json();
  const newCompra = await prisma.compra.create({
    data,
  });
  return NextResponse.json(newCompra);
}
