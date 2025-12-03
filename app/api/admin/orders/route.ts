import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET: Legge i dettagli di un singolo ordine
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

// PUT: Aggiorna stato, totale e prezzi dei singoli articoli
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status, finalTotal, items } = body;

    // Usiamo una transazione per aggiornare tutto insieme in modo sicuro
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Se ci sono articoli modificati, aggiorniamo i loro prezzi
      if (items && Array.isArray(items)) {
        for (const item of items) {
          await tx.orderItem.update({
            where: { id: item.id },
            data: { 
              price: Number(item.price), // Aggiorna il prezzo
              quantity: Number(item.quantity) // Aggiorna la quantità/peso se modificata
            }
          });
        }
      }

      // 2. Aggiorna l'ordine principale
      const updatedOrder = await tx.order.update({
        where: { id: params.id },
        data: {
          status: status,
          finalTotal: finalTotal ? Number(finalTotal) : null,
        },
        // Importante: restituiamo gli items aggiornati per aggiornare l'interfaccia
        include: { 
          items: { include: { product: true } }, 
          slot: true 
        }
      });

      return updatedOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Errore API PUT Order:", error);
    return NextResponse.json({ error: "Errore durante l'aggiornamento" }, { status: 500 });
  }
}