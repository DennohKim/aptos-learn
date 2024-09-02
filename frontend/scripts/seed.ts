const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient()

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: 'Aptos Basics' },
        { name: 'Move Language' },
        { name: 'Smart contracts' },
        { name: 'Dapp' },
        { name: 'DeFi' }
      ],
    })

    console.log('🟢 Seed script run successfully!🟢')
  } catch (error) {
    console.log('🔴 Error in seed script 🔴', error)
  } finally {
    await database.$disconnect()
  }
}

main()
