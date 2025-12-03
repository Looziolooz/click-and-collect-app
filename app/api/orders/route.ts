import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeId, slotId, name, email, phone, items, estimatedTotal } = body;

    console.log("📦 Ordine ricevuto:", { name, items: items?.length });

    // 1. Validazione input
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Il carrello è vuoto" }, { status: 400 });
    }

    // 2. Recupero Negozio (Fallback intelligente)
    let finalStoreId = storeId;
    if (!storeId || storeId === 'auto_select') {
      const store = await prisma.store.findFirst();
      if (!store) {
        return NextResponse.json({ error: "Errore config: Nessun negozio nel database" }, { status: 500 });
      }
      finalStoreId = store.id;
    }

    // 3. Recupero Slot (Fallback intelligente)
    let finalSlotId = slotId;
    // Se lo slotId è vuoto, finto o non esiste, ne cerchiamo uno valido
    const slotExists = await prisma.timeSlot.findUnique({ where: { id: slotId || "missing" } });
    
    if (!slotExists) {
       console.log("⚠️ Slot non trovato o non valido. Cerco il prossimo disponibile...");
       const fallbackSlot = await prisma.timeSlot.findFirst({ 
         where: { isAvailable: true, startTime: { gte: new Date() } } 
       });
       
       if (!fallbackSlot) {
         return NextResponse.json({ error: "Nessun orario di ritiro disponibile nel sistema." }, { status: 400 });
       }
       finalSlotId = fallbackSlot.id;
    }

    // 4. Transazione Database
    const result = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          storeId: finalStoreId,
          slotId: finalSlotId,
          customerName: name,
          customerEmail: email || "",
          customerPhone: phone,
          status: "PENDING",
          pickupTime: new Date(), 
          estimatedTotal: Number(estimatedTotal),
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          items: {
            create: items.map((item: any) => ({
              // Forziamo i tipi per evitare errori di Prisma
              productId: String(item.id),
              quantity: Number(item.quantity),
              unit: String(item.unit),
              price: Number(item.pricePerKg)
            }))
          }
        },
      });
      return newOrder;
    });

    console.log("✅ Ordine creato con ID:", result.id);
    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error("🔥 ERRORE CRITICO API:", error);
    
    // Gestione specifica: Prodotti nel carrello non esistono più nel DB
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: "Il carrello contiene prodotti obsoleti (ID non validi). Il carrello verrà svuotato." 
      }, { status: 400 });
    }

    // Risposta JSON garantita anche in caso di crash
    return NextResponse.json(
      { error: `Errore del server: ${error.message}` }, 
      { status: 500 }
    );
  }
}