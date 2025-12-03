import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT: Aggiorna un prodotto esistente (es. prezzo, nome, disponibilità)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        // Aggiorna solo i campi presenti nel body della richiesta
        name: body.name,
        description: body.description,
        // Convertiamo il prezzo in numero se presente, altrimenti undefined
        pricePerKg: body.pricePerKg ? parseFloat(body.pricePerKg) : undefined,
        category: body.category,
        // Gestione esplicita del booleano per la disponibilità
        isAvailable: body.isAvailable !== undefined ? body.isAvailable : undefined,
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Errore aggiornamento prodotto:", error);
    return NextResponse.json({ error: "Errore durante l'aggiornamento del prodotto" }, { status: 500 });
  }
}

// DELETE: Elimina un prodotto dal database
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, message: "Prodotto eliminato correttamente" });
  } catch (error) {
    console.error("Errore eliminazione prodotto:", error);
    // Codice P2025: Record non trovato (già eliminato o ID errato)
    if ((error as any).code === 'P2025') {
       return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });
    }
    return NextResponse.json({ error: "Impossibile eliminare il prodotto" }, { status: 500 });
  }
}