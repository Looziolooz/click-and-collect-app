import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Legge un singolo ordine
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { 
        items: { 
          include: { product: true } 
        },
        slot: true
      }
    });

    if (!order) return NextResponse.json({ error: "Non trovato" }, { status: 404 });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

// PUT: Aggiorna stato e prezzo
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status, finalTotal } = body;

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        finalTotal: Number(finalTotal),
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Errore aggiornamento" }, { status: 500 });
  }
}