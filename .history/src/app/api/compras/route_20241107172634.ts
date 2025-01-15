// src/app/api/compras/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener todas las compras
export async function GET() {
  try {
    const compras = await prisma.compra.findMany(); // Obtener todas las compras
    return NextResponse.json(compras, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las compras:", error);
    return NextResponse.json(
      { error: "Error al obtener las compras" },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva compra y actualizar saldo del proveedor
export async function POST(req: Request) {
  try {
    const { total, proveedorId } = await req.json();

    // Validar los campos requeridos
    if (
      typeof total !== "number" ||
      isNaN(total) ||
      typeof proveedorId !== "number" ||
      isNaN(proveedorId)
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios o están mal formateados" },
        { status: 400 }
      );
    }

    // Verificar si el proveedor existe
    const proveedorExistente = await prisma.proveedor.findUnique({
      where: { id: proveedorId },
    });

    if (!proveedorExistente) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    // Iniciar la transacción
    const nuevaCompra = await prisma.$transaction(async (prisma) => {
      // Crear la compra
      const compra = await prisma.compra.create({
        data: {
          total,
          proveedorId,
        },
      });

      // Actualizar saldo del proveedor
      const proveedor = await prisma.proveedor.update({
        where: { id: proveedorId },
        data: { saldo: { decrement: total } },
      });

      // Registrar el movimiento de cuenta
      await prisma.movimientoCuenta.create({
        data: {
          tipo: "debito",
          monto: total,
          saldo: proveedor.saldo,
          proveedorId: proveedor.id,
          referencia: `Compra ID: ${compra.id}`,
        },
      });

      return compra;
    });

    return NextResponse.json(nuevaCompra, { status: 201 });
  } catch (error) {
    // Afirmación de tipo para manejar el error
    if (error instanceof Error) {
      console.error("Error al crear la compra:", error.message);
      return NextResponse.json(
        { error: "Error al crear la compra: " + error.message },
        { status: 500 }
      );
    } else {
      console.error("Error desconocido al crear la compra:", error);
      return NextResponse.json(
        { error: "Error desconocido al crear la compra" },
        { status: 500 }
      );
    }
  }
}
