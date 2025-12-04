import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { category: 'asc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Errore recupero prodotti" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
        isAvailable: true
      }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Errore creazione" }, { status: 500 });
  }
}