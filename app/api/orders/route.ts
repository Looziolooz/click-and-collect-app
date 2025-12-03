import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeId, slotId, name, email, phone, items, estimatedTotal } = body;

    console.log("📦 Tentativo Ordine:", { name, itemsCount: items?.length });

    // 1. Validazione base
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Il carrello è vuoto" }, { status: 400 });
    }

    // 2. RECUPERO NEGOZIO INTELLIGENTE
    // Se il frontend manda "auto_select" o null, prendiamo il primo negozio del DB
    let finalStoreId = storeId;
    if (!storeId || storeId === 'auto_select') {
      const store = await prisma.store.findFirst();
      if (!store) {
        return NextResponse.json({ error: "Nessun negozio configurato nel sistema" }, { status: 500 });
      }
      finalStoreId = store.id;
    }

    // 3. RECUPERO SLOT (Con Fallback)
    // Se lo slotId non esiste, prendiamo il primo disponibile per non bloccare l'ordine
    let finalSlotId = slotId;
    const slotExists = await prisma.timeSlot.findUnique({ where: { id: slotId } });
    
    if (!slotExists) {
       console.log("⚠️ Slot non trovato, cerco fallback...");
       const fallbackSlot = await prisma.timeSlot.findFirst({ 
         where: { 
           isAvailable: true,
           startTime: { gte: new Date() } // Solo futuri
         } 
       });
       
       if (!fallbackSlot) {
         return NextResponse.json({ error: "Nessun orario di ritiro disponibile nel sistema." }, { status: 400 });
       }
       finalSlotId = fallbackSlot.id;
    }

    // 4. TRANSAZIONE
    const result = await prisma.$transaction(async (tx) => {
      
      const newOrder = await tx.order.create({
        data: {
          storeId: finalStoreId,
          slotId: finalSlotId,
          customerName: name,
          customerEmail: email || "",
          customerPhone: phone,
          status: "PENDING",
          pickupTime: new Date(), // Useremo la data dello slot in futuro
          estimatedTotal: Number(estimatedTotal),
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          
          items: {
            create: items.map((item: any) => ({
              // IMPORTANTE: Forziamo String per l'ID per evitare errori di tipo
              productId: String(item.id),
              quantity: Number(item.quantity),
              unit: item.unit,
              price: Number(item.pricePerKg)
            }))
          }
        },
      });

      return newOrder;
    });

    console.log("✅ Ordine creato:", result.id);
    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error("🔥 ERRORE CRITICO API:", error);
    
    // Gestione specifica errore "Carrello Vecchio"
    if (error.code === 'P2003') { // Foreign Key Constraint Failed
      return NextResponse.json({ 
        error: "Il carrello contiene prodotti non più esistenti. Svuota il carrello e riprova." 
      }, { status: 400 });
    }

    return NextResponse.json({ error: "Errore tecnico del server." }, { status: 500 });
  }
}