// src/pages/api/clientes/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Manejar las solicitudes a la ruta /api/clientes
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Obtener todos los clientes
    try {
      const clientes = await prisma.cliente.findMany();
      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los clientes" });
    }
  } else if (req.method === "POST") {
    // Crear un nuevo cliente
    const { razonSocial, direccion, cuit, zona, telefono, email, saldo } =
      req.body;
    try {
      const nuevoCliente = await prisma.cliente.create({
        data: {
          razonSocial,
          direccion,
          cuit,
          zona,
          telefono,
          email,
          saldo,
        },
      });
      res.status(201).json(nuevoCliente);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el cliente" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
