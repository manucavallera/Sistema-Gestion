import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta a tu cliente Prisma sea correcta

export async function POST(request: Request) {
  const data = await request.json();

  // Validación de datos
  if (
    !data.fecha ||
    !data.monto ||
    !data.clienteRazonSocial ||
    !data.proveedorRazonSocial
  ) {
    return NextResponse.json(
      { message: "Todos los campos son obligatorios." },
      { status: 400 }
    );
  }

  try {
    // Buscar cliente por razón social
    const cliente = await prisma.cliente.findUnique({
      where: { razonSocial: data.clienteRazonSocial },
    });

    // Buscar proveedor por razón social
    const proveedor = await prisma.proveedor.findUnique({
      where: { razonSocial: data.proveedorRazonSocial },
    });

    if (!cliente || !proveedor) {
      return NextResponse.json(
        { message: "Cliente o proveedor no encontrado." },
        { status: 404 }
      );
    }

    // Crear el cheque
    const nuevoCheque = await prisma.cheque.create({
      data: {
        fecha: new Date(data.fecha),
        monto: data.monto,
        clienteId: cliente.id,
        proveedorId: proveedor.id,
        deletedAt: null, // Establecer deletedAt en null para indicar que no está eliminado
      },
    });

    // Actualizar el saldo del cliente y proveedor
    await prisma.cliente.update({
      where: { id: cliente.id },
      data: { saldo: cliente.saldo + data.monto }, // Aumentar el saldo del cliente
    });

    await prisma.proveedor.update({
      where: { id: proveedor.id },
      data: { saldo: proveedor.saldo + data.monto }, // Aumentar el saldo del proveedor
    });

    return NextResponse.json(nuevoCheque, { status: 201 }); // Retornar 201 para creación exitosa
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
