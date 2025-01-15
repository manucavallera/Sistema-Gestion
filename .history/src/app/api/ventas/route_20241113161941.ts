import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las ventas y la lista de clientes
export async function GET() {
  try {
    const [ventas, clientes] = await Promise.all([
      prisma.venta.findMany(),
      prisma.cliente.findMany(),
    ]);

    return NextResponse.json({ ventas, clientes });
  } catch (error) {
    console.error(error); // Registrar el error para depuración
    return NextResponse.json(
      { error: "Error al obtener las ventas y clientes" },
      { status: 500 }
    );
  }
}

// Crear una nueva venta
export async function POST(request) {
  try {
    const data = await request.json(); // Obtener los datos del cuerpo de la solicitud

    const nuevaVenta = await prisma.venta.create({
      data: {
        // Asegúrate de que los campos coincidan con tu modelo Prisma
        campo1: data.campo1, // Reemplaza 'campo1' con el nombre real del campo
        campo2: data.campo2, // Reemplaza 'campo2' con el nombre real del campo
        // Agrega más campos según sea necesario
      },
    });

    return NextResponse.json(nuevaVenta, { status: 201 }); // Devuelve la nueva venta creada
  } catch (error) {
    console.error(error); // Registrar el error para depuración
    return NextResponse.json(
      { error: "Error al crear la venta" },
      { status: 500 }
    );
  }
}
