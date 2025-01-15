import { NextRequest, NextResponse } from "next/server";

// Simulación de una base de datos en memoria
let saldos = [
  { id: 1, clienteId: 1, saldo: 500 },
  { id: 2, clienteId: 2, saldo: 300 },
];

// Interfaz para el saldo
interface Saldo {
  id: number;
  clienteId: number;
  saldo: number;
}

// Obtener todos los saldos
export async function GET(request: NextRequest) {
  return NextResponse.json(saldos);
}

// Crear o actualizar un saldo
export async function POST(request: NextRequest) {
  const body: Saldo = await request.json();

  // Validación de datos
  if (!body.clienteId || typeof body.saldo !== "number" || body.saldo < 0) {
    return NextResponse.json(
      { error: "Datos inválidos para el saldo" },
      { status: 400 }
    );
  }

  // Verificar si ya existe un saldo para el cliente
  const existingSaldo = saldos.find((s) => s.clienteId === body.clienteId);
  if (existingSaldo) {
    // Actualizar saldo existente
    existingSaldo.saldo += body.saldo; // Ajusta según la lógica de tu aplicación
    return NextResponse.json(existingSaldo, { status: 200 });
  }

  // Generar un nuevo ID
  const newId = saldos.length > 0 ? saldos[saldos.length - 1].id + 1 : 1;

  const newSaldo: Saldo = {
    id: newId,
    ...body,
  };

  saldos.push(newSaldo);
  return NextResponse.json(newSaldo, { status: 201 });
}
