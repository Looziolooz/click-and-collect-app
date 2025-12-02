import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // 1. Leggiamo i parametri dall'URL (es. ?storeId=123&date=2024-05-20)
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const dateParam = searchParams.get("date");

  if (!storeId || !dateParam) {
    return NextResponse.json({ error: "StoreId and Date required" }, { status: 400 });
  }

  // 2. Calcoliamo l'inizio e la fine del giorno richiesto per filtrare il DB
  const startDate = new Date(dateParam);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  try {
    // 3. Chiediamo a Prisma gli slot
    const slots = await prisma.timeSlot.findMany({
      where: {
        storeId: storeId,
        startTime: {
          gte: startDate, // Maggiore o uguale a inizio giornata
          lt: endDate,    // Minore di fine giornata
        },
      },
      orderBy: {
        startTime: 'asc', // Ordiniamo dal mattino alla sera
      },
    });

    return NextResponse.json(slots);
    
  } catch (error) {
    // CORREZIONE: Ora usiamo la variabile 'error' stampandola in console
    // Questo risolve l'errore "'error' is defined but never used"
    console.error("Errore dettagliato nel recupero degli slot:", error);

    return NextResponse.json(
      { error: "Error fetching slots" }, 
      { status: 500 }
    );
  }
}