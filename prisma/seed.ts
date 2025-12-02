// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Inizio del seeding...')

  // 1. Pulizia: Cancelliamo i dati vecchi per evitare duplicati
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.timeSlot.deleteMany()
  await prisma.store.deleteMany()

  // 2. Creazione del Negozio
  const store = await prisma.store.create({
    data: {
      name: 'Click & Collect - Milano Centro',
      slug: 'milano-centro',
      address: 'Piazza del Duomo, 1, 20121 Milano',
      phone: '+39 02 12345678',
      email: 'milano@store.com',
      slotDuration: 30, // Slot da 30 minuti
      maxOrdersPerSlot: 5, // Max 5 persone per slot
    }
  })

  console.log(`🏪 Negozio creato: ${store.name}`)

  // 3. Generazione Slot Temporali per "Domani"
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  // Orari di apertura: 09:00 - 18:00
  const startHour = 9
  const endHour = 18
  const slots = []

  // Ciclo per creare gli slot ogni 30 minuti
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += store.slotDuration) {
      
      const slotStart = new Date(tomorrow)
      slotStart.setHours(hour, minute, 0, 0)
      
      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotStart.getMinutes() + store.slotDuration)

      slots.push({
        storeId: store.id,
        startTime: slotStart,
        endTime: slotEnd,
        maxCapacity: store.maxOrdersPerSlot
      })
    }
  }

  // Salvataggio slot nel DB
  await prisma.timeSlot.createMany({
    data: slots
  })

  console.log(`📅 Generati ${slots.length} slot temporali per domani.`)
  console.log('✅ Seeding completato!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })