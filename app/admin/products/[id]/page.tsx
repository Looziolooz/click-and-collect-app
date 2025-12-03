import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        pricePerKg: body.pricePerKg ? parseFloat(body.pricePerKg) : undefined,
        isAvailable: body.isAvailable,
        name: body.name,
        description: body.description
      }
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Errore aggiornamento" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Errore eliminazione" }, { status: 500 });
  }
}