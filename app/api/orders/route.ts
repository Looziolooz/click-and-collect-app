import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📥 Ricevuto payload ordine:", body); // Debug nel terminale

    const { storeId, slotId, name, email, phone, items, estimatedTotal } = body;

    // 1. Validazione Dati
    if (!name || !phone || !items || items.length === 0 || !slotId) {
      console.error("❌ Dati mancanti");
      return NextResponse.json({ error: "Dati dell'ordine incompleti" }, { status: 400 });
    }

    // 2. Recupero Negozio (Gestione 'auto_select')
    let finalStoreId = storeId;
    if (storeId === 'auto_select') {
      const store = await prisma.store.findFirst();
      if (!store) {
        console.error("❌ Nessun negozio nel DB");
        return NextResponse.json({ error: "Configurazione negozio mancante" }, { status: 500 });
      }
      finalStoreId = store.id;
    }

    // 3. Validazione Slot
    const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } });
    if (!slot) {
      console.error(`❌ Slot ID ${slotId} non trovato nel DB`);
      return NextResponse.json({ error: "L'orario selezionato non è più disponibile" }, { status: 400 });
    }

    // 4. Transazione di Salvataggio
    const result = await prisma.$transaction(async (tx) => {
      
      const newOrder = await tx.order.create({
        data: {
          storeId: finalStoreId,
          slotId: slotId, // Usiamo l'ID reale
          customerName: name,
          customerEmail: email || "",
          customerPhone: phone,
          status: "PENDING",
          pickupTime: slot.startTime, // Usiamo l'orario reale dello slot
          
          // Conversione sicura per Decimal
          estimatedTotal: Number(estimatedTotal), 
          
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          
          // Creazione Items
         items: {
            create: items.map((item: any) => ({
              // Assicuriamoci che i valori siano numeri e l'ID stringa
              productId: String(item.id),
              quantity: Number(item.quantity),
              unit: String(item.unit),
              price: Number(item.pricePerKg)
            }))
          }
        },
      });

      // Aggiorna contatore slot (opzionale)
      await tx.timeSlot.update({
        where: { id: slotId },
        data: { bookedCount: { increment: 1 } },
      });

      return newOrder;
    });

    console.log("✅ Ordine creato con successo:", result.id);
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error("🔥 ERRORE CRITICO API:", error);
    // Restituiamo l'errore reale al frontend per capire cosa succede
    return NextResponse.json(
      { error: "Errore interno del server durante il salvataggio" }, 
      { status: 500 }
    );
  }
}