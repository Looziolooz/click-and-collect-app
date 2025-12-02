import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SlotPicker from "@/components/booking/SlotPicker"; // <--- 1. Importa questo

export default async function BookingPage({ params }: { params: { slug: string } }) {
  
  const store = await prisma.store.findUnique({
    where: { slug: params.slug },
  });

  if (!store) { notFound(); }

  return (
    <div className="min-h-screen bg-cream p-6 flex flex-col items-center">
      {/* ... header ... */}
      
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-sage/20 overflow-hidden">
        {/* ... store info ... */}

        <div className="p-8">
          {/* ... testo descrittivo ... */}

          <div className="mt-8">
            {/* 2. INSERISCI IL COMPONENTE QUI, passando l'ID del negozio */}
            <SlotPicker storeId={store.id} />
          </div>
        </div>
      </div>
    </div>
  );
}