import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE: Eliminar una forma de pago por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formaDePagoId = Number(params.id);
    if (isNaN(formaDePagoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const formaDePago = await prisma.formaDePago.findUnique({
      where: { id: formaDePagoId },
    });

    if (!formaDePago) {
      return NextResponse.json(
        { error: "Forma de pago no encontrada" },
        { status: 404 }
      );
    }

    await prisma.formaDePago.delete({
      where: { id: formaDePagoId },
    });

    return NextResponse.json({
      message: "Forma de pago eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar la forma de pago:", error);
    return NextResponse.json(
      { error: "Error al eliminar la forma de pago" },
      { status: 500 }
    );
  }
}
