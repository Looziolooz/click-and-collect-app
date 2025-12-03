import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date'); // Formato atteso: YYYY-MM-DD

    const store = await prisma.store.findFirst();
    if (!store) return NextResponse.json([], { status: 200 });

    // Costruiamo il filtro temporale
    let dateFilter = {};
    
    if (dateParam) {
      // Se c'è una data specifica, cerchiamo da 00:00 alle 23:59 di quel giorno
      const startOfDay = new Date(dateParam);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(dateParam);
      endOfDay.setHours(23, 59, 59, 999);

      dateFilter = {
        gte: startOfDay,
        lte: endOfDay
      };
    } else {
      // Se non c'è data, mostriamo da ADESSO in poi (fallback)
      dateFilter = {
        gte: new Date()
      };
    }

    const slots = await prisma.timeSlot.findMany({
      where: {
        storeId: store.id,
        isAvailable: true,
        startTime: dateFilter,
        // Nascondiamo slot già passati se stiamo guardando oggi
        // (La logica gte sopra gestisce la data, ma per l'orario specifico serve attenzione nel frontend o qui)
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    // Filtro ulteriore di sicurezza: se la data è oggi, nascondiamo gli orari passati
    const now = new Date();
    const validSlots = slots.filter(slot => {
        return new Date(slot.startTime) > now;
    });

    return NextResponse.json(validSlots);
  } catch (error) {
    return NextResponse.json({ error: "Errore caricamento slot" }, { status: 500 });
  }
}