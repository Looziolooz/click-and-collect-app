import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET: Lista prodotti
export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { category: 'asc' } });
  return NextResponse.json(products);
}

// POST: Crea nuovo prodotto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        pricePerKg: parseFloat(body.pricePerKg),
        category: body.category,
        unit: body.unit || 'kg',
        image: body.image || '/assets/placeholder.jpg',
        isAvailable: true
      }
    });
    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json({ error: "Errore creazione" }, { status: 500 });
  }
}