import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Impedisce che la pagina venga salvata nella cache (così vedi sempre i nuovi ordini)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Recupera tutti gli ordini dal database
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc', // Mette i più recenti in alto
      },
      include: {
        items: true, // Scarica anche i dettagli dei prodotti
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Errore fetch ordini admin:", error);
    return NextResponse.json({ error: "Errore nel recupero degli ordini" }, { status: 500 });
  }
}