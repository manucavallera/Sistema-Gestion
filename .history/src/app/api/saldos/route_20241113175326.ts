import { NextRequest, NextResponse } from "next/server";

// Simulación de una base de datos en memoria
let saldos = [
  { id: 1, clienteId: 1, saldo: 500 },
  { id: 2, clienteId: 2, saldo: 300 },
];

// Obtener todos los saldos
export async function GET(request: NextRequest) {
  return NextResponse.json(saldos);
}

// Crear un nuevo saldo
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validación de datos
  if (!body.clienteId || typeof body.saldo !== "number" || body.saldo < 0) {
    return NextResponse.json(
      { error: "Datos inválidos para el saldo" },
      { status: 400 }
    );
  }

  // Generar un nuevo ID
  const newId = saldos.length > 0 ? saldos[saldos.length - 1].id + 1 : 1;

  const newSaldo = {
    id: newId,
    ...body,
  };

  saldos.push(newSaldo);
  return NextResponse.json(newSaldo, { status: 201 });
}
