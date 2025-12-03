import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Inizio del seeding esteso...')

  // 1. Pulizia (in ordine per vincoli di chiave esterna)
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.timeSlot.deleteMany()
  await prisma.product.deleteMany()
  await prisma.store.deleteMany()

  // 2. Negozio
  const store = await prisma.store.create({
    data: {
      name: 'Pescheria Fresco&Fresco',
      slug: 'lamezia-terme',
      address: 'Via del Progresso 42, Lamezia Terme',
      phone: '+39 333 1234567',
      email: 'info@frescofresco.it',
      slotDuration: 30, 
      maxOrdersPerSlot: 5,
    }
  })

  // 3. Prodotti
  const products = [
    { name: "Orata", description: "Orata fresca del Mediterraneo.", pricePerKg: 18.50, unit: "kg", category: "premium", image: "/assets/fresh-sea-bass-bream.jpg" },
    { name: "Branzino", description: "Branzino fresco di prima qualità.", pricePerKg: 22.00, unit: "kg", category: "premium", image: "/assets/fresh-sea-bass-bream.jpg" },
    { name: "Sardine", description: "Sardine fresche del Tirreno.", pricePerKg: 8.00, unit: "kg", category: "blue", image: "/assets/blue-fish-selection.jpg" },
    { name: "Cozze", description: "Cozze fresche pulite.", pricePerKg: 4.50, unit: "kg", category: "shellfish", image: "/assets/seafood-shellfish-display_variant_1.png" },
    { name: "Gamberi Rossi", description: "Gamberi rossi locali.", pricePerKg: 45.00, unit: "kg", category: "shellfish", image: "/assets/seafood-shellfish-display.jpg" },
    { name: "Pesce Spada", description: "Trancio di pesce spada fresco.", pricePerKg: 28.00, unit: "kg", category: "premium", image: "/assets/fresh-sea-bass-bream.jpg" },
  ]

  for (const p of products) {
    await prisma.product.create({ data: p })
  }

  // 4. Generazione Slot per i prossimi 30 GIORNI
  const slots = []
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + i)
    
    // Salta Domenica (0) e Lunedì (1)
    const day = currentDate.getDay()
    if (day === 0 || day === 1) continue;

    // Genera orari dalle 08:00 alle 14:00
    for (let hour = 8; hour < 14; hour++) {
      for (let minute = 0; minute < 60; minute += store.slotDuration) {
        // Salta l'ultimo slot oltre orario
        if (hour === 13 && minute >= 30) continue;

        const start = new Date(currentDate)
        start.setHours(hour, minute, 0, 0)
        
        const end = new Date(start)
        end.setMinutes(start.getMinutes() + store.slotDuration)
        
        slots.push({
          storeId: store.id,
          startTime: start,
          endTime: end,
          maxCapacity: store.maxOrdersPerSlot
        })
      }
    }
  }

  // Inseriamo a blocchi per evitare errori di memoria se sono troppi
  await prisma.timeSlot.createMany({ data: slots })

  console.log(`✅ Seeding completato! Generati ${slots.length} slot temporali per i prossimi 30 giorni.`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })