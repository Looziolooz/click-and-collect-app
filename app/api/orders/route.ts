import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Disabilitiamo la cache per vedere sempre i nuovi ordini in tempo reale
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("🔍 Admin: Recupero ordini..."); // Debug nel terminale

    const orders = await prisma.order.findMany({
      include: {
        // Includiamo i dettagli dei prodotti ordinati
        items: {
          include: {
            product: true 
          }
        },
        // Includiamo i dettagli dello slot orario
        slot: true 
      },
      orderBy: {
        createdAt: 'desc' // I più recenti in alto
      }
    });

    console.log(`✅ Trovati ${orders.length} ordini.`);
    return NextResponse.json(orders);

  } catch (error) {
    console.error("🔥 Errore API Admin Orders:", error);
    return NextResponse.json(
      { error: "Errore durante il caricamento degli ordini" }, 
      { status: 500 }
    );
  }
}