import { NextApiRequest, NextApiResponse } from "next";
import { archiveOldData } from "../services/dataService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await archiveOldData();
      res.status(200).json({ message: "Datos archivados exitosamente." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al archivar datos." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
