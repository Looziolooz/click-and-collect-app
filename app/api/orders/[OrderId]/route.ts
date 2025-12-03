import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeId, slotId, name, email, phone, items, estimatedTotal } = body;

    console.log("📦 Nuova richiesta ordine:", { customer: name, items: items?.length });

    // 1. Validazione Dati
    if (!name || !phone || !items || items.length === 0 || !slotId) {
      return NextResponse.json({ error: "Dati dell'ordine incompleti o carrello vuoto" }, { status: 400 });
    }

    // 2. Recupero Negozio (Gestione 'auto_select')
    let finalStoreId = storeId;
    if (!storeId || storeId === 'auto_select') {
      const store = await prisma.store.findFirst();
      if (!store) {
        return NextResponse.json({ error: "Nessun negozio configurato nel database" }, { status: 500 });
      }
      finalStoreId = store.id;
    }

    // 3. Validazione Slot (Con Fallback di sicurezza)
    let finalSlotId = slotId;
    const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } });
    
    if (!slot) {
      console.warn(`⚠️ Slot ID ${slotId} non trovato. Cerco fallback...`);
      // Se lo slot scelto non esiste più, prendiamo il primo disponibile futuro per non perdere l'ordine
      const fallbackSlot = await prisma.timeSlot.findFirst({
        where: { isAvailable: true, startTime: { gte: new Date() } }
      });
      
      if (!fallbackSlot) {
        return NextResponse.json({ error: "Nessun orario di ritiro disponibile." }, { status: 400 });
      }
      finalSlotId = fallbackSlot.id;
    }

    // 4. Transazione di Salvataggio
    const result = await prisma.$transaction(async (tx) => {
      
      const newOrder = await tx.order.create({
        data: {
          storeId: finalStoreId,
          slotId: finalSlotId,
          customerName: name,
          customerEmail: email || "",
          customerPhone: phone,
          status: "PENDING",
          // Usiamo l'orario dello slot trovato
          pickupTime: slot ? slot.startTime : new Date(), 
          
          estimatedTotal: Number(estimatedTotal),
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          
          items: {
            create: items.map((item: any) => ({
              // IMPORTANTE: Assicuriamo che i tipi siano corretti
              productId: String(item.id),
              quantity: Number(item.quantity),
              unit: item.unit,
              price: Number(item.pricePerKg)
            }))
          }
        },
      });

      // Aggiorna contatore slot (opzionale)
      await tx.timeSlot.update({
        where: { id: finalSlotId },
        data: { bookedCount: { increment: 1 } },
      });

      return newOrder;
    });

    console.log("✅ Ordine creato:", result.orderNumber);
    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error("🔥 ERRORE API:", error);
    
    // Gestione specifica per prodotti vecchi nel carrello (Errore chiave esterna Prisma)
    if (error.code === 'P2003') {
        return NextResponse.json({ 
            error: "Il carrello contiene prodotti non più esistenti (ID obsoleti). Il carrello verrà svuotato." 
        }, { status: 400 });
    }

    return NextResponse.json(
      { error: `Errore del server: ${error.message}` }, 
      { status: 500 }
    );
  }
}