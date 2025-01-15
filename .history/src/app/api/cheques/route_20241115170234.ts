import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta a tu cliente Prisma sea correcta

// Función para validar datos
const validateChequeData = (data) => {
  if (!data.fechaEmision || !data.fechaVencimiento || !data.monto || (!data.clienteId && !data.proveedorId)) {
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
    return { valid: false, message: "La fecha de emisión no puede ser posterior a la fecha de vencimiento." };
  }

  return { valid: true };
};

// Endpoint para crear un cheque
export async function POST(request) {
  const data = await request.json();
  const validation = validateChequeData(data);
  
  if (!validation.valid) {
    return NextResponse.json({ message: validation.message }, { status: 400 });
  }

  const fechaEmision = new Date(data.fechaEmision);
  const fechaVencimiento = new Date(data.fechaVencimiento);

  try {
    const cliente = data.clienteId ? await prisma.cliente.findUnique({ where: { id: data.clienteId } }) : null;
    const proveedor = data.proveedorId ? await prisma.proveedor.findUnique({ where: { id: data.proveedorId } }) : null;

    if (!cliente && !proveedor) {
      return NextResponse.json({ message: "Cliente o proveedor no encontrado." }, { status: 404 });
    }

    const nuevoCheque = await prisma.$transaction(async (prisma) => {
      const cheque = await prisma.cheque.create({
        data: {
          banco: data.banco || "Sin banco",
          sucursal: data.sucursal || "Sin sucursal",
          numero: data.numero || "Sin número",
          monto: data.monto,
          fechaEmision,
          fechaVencimiento,
          clienteId: cliente ? cliente.id : null,
          proveedorId: proveedor ? proveedor.id : null,
          deletedAt: null,
        },
      });

      if (cliente) {
        await prisma.cliente.update({
          where: { id: cliente.id },
          data: { saldo: cliente.saldo + data.monto },
        });
      }

      if (proveedor) {
        await prisma.proveedor.update({
          where: { id: proveedor.id },
         