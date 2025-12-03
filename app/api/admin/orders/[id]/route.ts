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

// PUT: Aggiorna stato, prezzo finale e prezzi dei singoli articoli
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status, finalTotal, items } = body; // Ora riceviamo anche 'items' per aggiornare i prezzi singoli

    // Usiamo una transazione per aggiornare ordine e singoli prodotti insieme
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Aggiorna i prezzi dei singoli item se presenti nell'array ricevuto
      if (items && Array.isArray(items)) {
        for (const item of items) {
          await tx.orderItem.update({
            where: { id: item.id },
            data: { 
              price: Number(item.price), // Aggiorna il prezzo reale al kg/pezzo modificato dall'admin
              quantity: Number(item.quantity) // Aggiorna anche il peso se modificato
            }
          });
        }
      }

      // 2. Aggiorna lo stato e il totale finale dell'ordine principale
      const updatedOrder = await tx.order.update({
        where: { id: params.id },
        data: {
          status: status,
          finalTotal: finalTotal ? Number(finalTotal) : null,
        },
        // Includiamo gli items nella risposta per aggiornare immediatamente l'interfaccia
        include: { items: { include: { product: true } }, slot: true }
      });

      return updatedOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Errore API PUT Order:", error);
    return NextResponse.json({ error: "Errore aggiornamento" }, { status: 500 });
  }
}