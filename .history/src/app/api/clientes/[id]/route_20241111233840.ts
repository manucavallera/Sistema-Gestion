// src/pages/api/clientes/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const cliente = await prisma.cliente.findUnique({
        where: { id: parseInt(id as string) },
      });
      if (!cliente)
        return res.status(404).json({ error: "Cliente no encontrado" });
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el cliente" });
    }
  } else if (req.method === "PUT") {
    const { razonSocial, direccion, cuit, zona, telefono, email, saldo } =
      req.body;
    try {
      const clienteActualizado = await prisma.cliente.update({
        where: { id: parseInt(id as string) },
        data: {
          razonSocial,
          direccion,
          cuit,
          zona,
          telefono,
          email,
          saldo: saldo || 0,
        },
      });
      res.status(200).json(clienteActualizado);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el cliente" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.cliente.delete({
        where: { id: parseInt(id as string) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el cliente" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
