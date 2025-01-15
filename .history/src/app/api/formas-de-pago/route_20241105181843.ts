import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta a Prisma sea la correcta

// GET: Listar todas las formas de pago
export async function GET() {
  try {
    const formasDePago = await prisma.formaDePago.findMany();
    return NextResponse.json(formasDePago);
  } catch (error) {
    console.error("Error al listar formas de pago:", error);
    return NextResponse.json(
      { error: "Error al listar formas de pago" },
      { status: 500 }
    );
  }
}

// POST: Agregar una nueva forma de pago
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validar que se proporcione el nombre de la forma de pago
    if (!data.nombre) {
      return NextResponse.json(
        { error: "El nombre de la forma de pago es obligatorio" },
        { status: 400 }
      );
    }

    const nuevaFormaDePago = await prisma.formaDePago.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion || "", // Puedes agregar otros campos opcionales aquí
      },
    });

    return NextResponse.json(nuevaFormaDePago, { status: 201 });
  } catch (error) {
    console.error("Error al agregar una forma de pago:", error);
    return NextResponse.json(
      { error: "Error al agregar una forma de pago" },
      { status: 500 }
    );
  }
}
