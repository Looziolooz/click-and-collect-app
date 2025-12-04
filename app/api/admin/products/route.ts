import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET: Ottiene tutti i prodotti (anche quelli non disponibili) per l'admin
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { category: 'asc' } // Ordina per categoria per raggrupparli visivamente
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Errore recupero prodotti" }, { status: 500 });
  }
}

// POST: Crea un nuovo prodotto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validazione base
    if (!body.name || !body.pricePerKg) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || "",
        pricePerKg: parseFloat(body.pricePerKg),
        unit: body.unit || "kg",
        category: body.category || "general",
        image: body.image || null,
        isAvailable: true // Di default disponibile
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Errore creazione prodotto:", error);
    return NextResponse.json({ error: "Errore creazione prodotto" }, { status: 500 });
  }
}