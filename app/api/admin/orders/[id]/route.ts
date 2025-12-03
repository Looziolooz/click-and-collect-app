import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Legge i dettagli dell'ordine
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

    if (!order) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Errore API GET Order:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

// PUT: Aggiorna stato e prezzo finale
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status, finalTotal } = body;

    // Aggiorniamo l'ordine nel DB
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: status,
        finalTotal: finalTotal ? Number(finalTotal) : null,
      },
      // --- CORREZIONE: Includiamo di nuovo le relazioni nella risposta ---
      include: { 
        items: { 
          include: { product: true } 
        },
        slot: true
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Errore API PUT Order:", error);
    return NextResponse.json({ error: "Errore durante l'aggiornamento" }, { status: 500 });
  }
}