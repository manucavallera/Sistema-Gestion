import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta a tu cliente Prisma sea correcta

// Función para validar datos
const validateChequeData = (data: any) => {
  if (
    !data.fechaEmision ||
    !data.fechaVencimiento ||
    !data.monto ||
    (!data.clienteId &&
      !data.proveedorId &&
      !data.clienteRazonSocial &&
      !data.proveedorRazonSocial)
  ) {
    return { valid: false, message: "Todos los campos son obligatorios." };
  }

  const fechaEmision = new Date(data.fechaEmision);
  const fechaVencimiento = new Date(data.fechaVencimiento);

  if (isNaN(fechaEmision.getTime()) || isNaN(fechaVencimiento.getTime())) {
    return { valid: false, message: "Las fechas son inválidas." };
  }

  if (isNaN(data.monto) || data.monto <= 0) {
    return { valid: false, message: "El monto debe ser un número positivo." };
  }

  if (fechaEmision > fechaVencimiento) {
    return {
      valid: false,
      message:
        "La fecha de emisión no puede ser posterior a la fecha de vencimiento.",
    };
  }

  return { valid: true };
};

// Endpoint para crear un cheque
export async function POST(request: Request) {
  const data = await request.json();
  const validation = validateChequeData(data);

  if (!validation.valid) {
    return NextResponse.json({ message: validation.message }, { status: 400 });
  }

  const fechaEmision = new Date(data.fechaEmision);
  const fechaVencimiento = new Date(data.fechaVencimiento);

  // Convertir clienteId y proveedorId a enteros
  const clienteId = data.clienteId ? parseInt(data.clienteId, 10) : null;
  const proveedorId = data.proveedorId ? parseInt(data.proveedorId, 10) : null;

  try {
    // Buscar cliente por ID o razón social
    const cliente = clienteId
      ? await prisma.cliente.findUnique({ where: { id: clienteId } })
      : data.clienteRazonSocial
      ? await prisma.cliente.findFirst({
          where: { razonSocial: data.clienteRazonSocial },
        })
      : null;

    // Buscar proveedor por ID o razón social
    const proveedor = proveedorId
      ? await prisma.proveedor.findUnique({ where: { id: proveedorId } })
      : data.proveedorRazonSocial
      ? await prisma.proveedor.findFirst({
          where: { razonSocial: data.proveedorRazonSocial },
        })
      : null;

    if (!cliente && !proveedor) {
      return NextResponse.json(
        { message: "Cliente o proveedor no encontrado." },
        { status: 404 }
      );
    }

    const nuevoCheque = await prisma.cheque.create({
      data: {
        banco: data.banco || "Sin banco",
        sucursal: data.sucursal || "Sin sucursal",
        numero: data.numero || "Sin número",
        monto: data.monto,
        fechaEmision,
        fechaVencimiento,
        clienteId: cliente ? cliente.id : null,
        proveedorId: proveedor ? proveedor.id : null,
        utilizado: false, // Establecer utilizado en false por defecto
        deletedAt: null,
      },
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
  const clienteRazonSocial = searchParams.get("clienteRazonSocial");
  const proveedorRazonSocial = searchParams.get("proveedorRazonSocial");
  const utilizado = searchParams.get("utilizado") === "true"; // Filtrar por utilizado si se proporciona

  try {
    const cheques = await prisma.cheque.findMany({
      where: {
        ...(clienteRazonSocial && {
          cliente: { razonSocial: clienteRazonSocial },
        }),
        ...(proveedorRazonSocial && {
          proveedor: { razonSocial: proveedorRazonSocial },
        }),
        ...(utilizado !== undefined && { utilizado }), // Filtrar por utilizado
      },
      include: {
        cliente: true,
        proveedor: true,
      },
      orderBy: {
        fechaEmision: "desc",
      },
    });

    return NextResponse.json(cheques, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los cheques:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { message: "Error al obtener los cheques", error: errorMessage },
      { status: 500 }
    );
  }
}

// Endpoint para eliminar un cheque
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "", 10);

  if (isNaN(id)) {
    return NextResponse.json({ message: "ID inválido." }, { status: 400 });
  }

  try {
    const cheque = await prisma.cheque.delete({
      where: { id },
    });

    return NextResponse.json(cheque, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar el cheque:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { message: "Error al eliminar el cheque", error: errorMessage },
      { status: 500 }
    );
  }
}
