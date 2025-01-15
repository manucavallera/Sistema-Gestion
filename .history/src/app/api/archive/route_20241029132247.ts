import { NextResponse } from "next/server";
import { archiveOldData } from "@/app/services/dataService"; // Ajusta la ruta si es necesario

export async function POST() {
  try {
    await archiveOldData();
    return NextResponse.json(
      { message: "Datos archivados con éxito." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al archivar datos:", error);
    return NextResponse.json(
      { message: "Error al archivar datos." },
      { status: 500 }
    );
  }
}
