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
];

let saldos = [{ id: 1, clienteId: 1, saldo: 500 }];

// Obtener todos los movimientos
export async function GETMovimientos(request: NextRequest) {
  return NextResponse.json(movimientos);
}

// Crear un nuevo movimiento
export async function POSTMovimientos(request: NextRequest) {
  const body = await request.json();
  const newMovimiento = {
    id: movimientos.length + 1,
    ...body,
  };
  movimientos.push(newMovimiento);
  return NextResponse.json(newMovimiento, { status: 201 });
}

// Obtener todos los saldos
export async function GETSaldos(request: NextRequest) {
  return NextResponse.json(saldos);
}

// Crear un nuevo saldo
export async function POSTSaldos(request: NextRequest) {
  const body = await request.json();
  const newSaldo = {
    id: saldos.length + 1,
    ...body,
  };
  saldos.push(newSaldo);
  return NextResponse.json(newSaldo, { status: 201 });
}

// Obtener un movimiento específico
export async function GETMovimiento(
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
export async function PUTMovimiento(
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
export async function DELETEMovimiento(
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
