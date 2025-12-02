import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Destrutturiamo i campi in arrivo dal Frontend
    const { 
      slotId, 
      storeId,
      customerName, 
      customerEmail, 
      customerPhone,
      requestDetails, // Questo è il testo "Cosa desideri ordinare"
      specialNotes,
      privacyAccepted
    } = body;

    // 1. Validazione Rigorosa
    if (!slotId || !customerName || !customerPhone || !requestDetails) {
      return NextResponse.json(
        { error: "Mancano dati obbligatori (Nome, Telefono o Dettagli Ordine)" },
        { status: 400 }
      );
    }

    if (!privacyAccepted) {
       return NextResponse.json(
        { error: "È necessario accettare la privacy policy" },
        { status: 400 }
      );
    }

    // 2. Transazione Database
    const result = await prisma.$transaction(async (tx) => {
      
      // Controlliamo lo slot
      const slot = await tx.timeSlot.findUnique({
        where: { id: slotId },
      });

      if (!slot) throw new Error("Slot non trovato");
      if (slot.bookedCount >= slot.maxCapacity) throw new Error("Slot pieno");

      // Creazione Ordine
      const newOrder = await tx.order.create({
        data: {
          storeId,
          slotId,
          customerName,
          customerEmail: customerEmail || null, // Gestisce stringa vuota o undefined
          customerPhone,
          
          // --- CORREZIONE QUI SOTTO ---
          // Il campo nel DB si chiama 'requestDetails', non 'description'
          requestDetails: requestDetails, 
          
          specialNotes: specialNotes || null,
          pickupTime: slot.startTime, // Salviamo l'orario di ritiro
          status: "PENDING", // Stringa semplice (compatibile con SQLite)
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          privacyAccepted: true
        },
      });

      // Aggiorna contatore slot
      await tx.timeSlot.update({
        where: { id: slotId },
        data: { bookedCount: { increment: 1 } },
      });

      return newOrder;
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error("Errore creazione ordine:", error);
    return NextResponse.json(
      { error: "Errore interno durante il salvataggio." },
      { status: 500 }
    );
  }
}