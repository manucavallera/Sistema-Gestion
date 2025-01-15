// src/app/api/clientes.ts
import { NextResponse } from "next/server";

let clientes: {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
}[] = []; // Simulación de una base de datos en memoria

export async function GET() {
  return NextResponse.json(clientes);
}

export async function POST(request: Request) {
  const nuevoCliente = await request.json();
  clientes.push({ id: Date.now(), ...nuevoCliente });
  return NextResponse.json(nuevoCliente);
}

export async function PUT(request: Request) {
  const { id, ...actualizado } = await request.json();
  const index = clientes.findIndex((cliente) => cliente.id === id);
  if (index !== -1) {
    clientes[index] = { ...clientes[index], ...actualizado };
    return NextResponse.json(clientes[index]);
  }
  return NextResponse.error();
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  clientes = clientes.filter((cliente) => cliente.id !== id);
  return NextResponse.json({ message: "Cliente eliminado" });
}
