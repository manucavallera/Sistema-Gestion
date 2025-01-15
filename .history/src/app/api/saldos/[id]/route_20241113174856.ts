import { NextRequest, NextResponse } from "next/server";

// Simulación de una base de datos en memoria
let saldos = [
  { id: 1, clienteId: 1, saldo: 500 },
  { id: 2, clienteId: 2, saldo: 300 },
  // Agrega más saldos según sea necesario
];

// Obtener un saldo específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const saldo = saldos.find((s) => s.id === parseInt(params.id));
  if (!saldo) {
    return NextResponse.json({ error: "Saldo no encontrado" }, { status: 404 });
  }
  return NextResponse.json(saldo);
}

// Actualizar un saldo específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = saldos.findIndex((s) => s.id === parseInt(params.id));
  if (index === -1) {
    return NextResponse.json({ error: "Saldo no encontrado" }, { status: 404 });
  }
  const body = await request.json();
  saldos[index] = { ...saldos[index], ...body };
  return NextResponse.json(saldos[index]);
}

// Eliminar un saldo específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = saldos.findIndex((s) => s.id === parseInt(params.id));
  if (index === -1) {
    return NextResponse.json({ error: "Saldo no encontrado" }, { status: 404 });
  }
  saldos.splice(index, 1);
  return NextResponse.json({ message: "Saldo eliminado" });
}
