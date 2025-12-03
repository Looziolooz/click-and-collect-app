// FILE: app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Scarica tutti gli ordini per la Dashboard e lo Storico
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Errore nel recupero ordini" }, { status: 500 });
  }
}