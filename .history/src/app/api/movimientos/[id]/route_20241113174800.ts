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
  // Agrega más movimientos según sea necesario
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
  const body = await request.json();
  movimientos[index] = { ...movimientos[index], ...body };
  return NextResponse.json(movimientos[index]);
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
  movimientos.splice(index, 1);
  return NextResponse.json({ message: "Movimiento eliminado" });
}
