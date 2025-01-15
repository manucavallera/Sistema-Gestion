import { NextRequest, NextResponse } from "next/server";

// Simulación de una base de datos en memoria
let movimientos = [
  {
    id: 1,
    clienteId: 1,
    proveedorId: 2,
    monto: 100,
    tipo: "ingreso",
    formaPago: "efectivo",
    descripcion: "Pago por servicios",
  },
  {
    id: 2,
    clienteId: 2,
    proveedorId: 3,
    monto: 200,
    tipo: "egreso",
    formaPago: "tarjeta",
    descripcion: "Compra de materiales",
  },
];

// Obtener un movimiento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const movimiento = movimientos.find((m) => m.id === parseInt(params.id));
  if (!movimiento) {
    return NextResponse.json(
      { error: "Movimiento no encontrado" },
      { status: 404 }
    );
  }
  return NextResponse.json(movimiento);
}

// Actualizar un movimiento específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = movimientos.findIndex((m) => m.id === parseInt(params.id));
  if (index === -1) {
    return NextResponse.json(
      { error: "Movimiento no encontrado" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();

    // Validación de datos
    if (
      typeof body.monto !== "number" ||
      body.monto <= 0 ||
      !["ingreso", "egreso"].includes(body.tipo)
    ) {
      return NextResponse.json(
        {
          error:
            "Datos inválidos: monto debe ser un número positivo y tipo debe ser 'ingreso' o 'egreso'.",
        },
        { status: 400 }
      );
    }

    // Actualiza el movimiento
    movimientos[index] = { ...movimientos[index], ...body };
    return NextResponse.json(movimientos[index]);
  } catch (error) {
    console.error(error); // Registro del error para depuración
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

// Eliminar un movimiento específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = movimientos.findIndex((m) => m.id === parseInt(params.id));
  if (index === -1) {
    return NextResponse.json(
      { error: "Movimiento no encontrado" },
      { status: 404 }
    );
  }

  // Elimina el movimiento
  movimientos.splice(index, 1);
  return NextResponse.json({ message: "Movimiento eliminado" });
}
