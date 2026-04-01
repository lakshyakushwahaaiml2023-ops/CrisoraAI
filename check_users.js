
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

async function main() {
  const users = await prisma.user.findMany()
  let output = `Total users in database: ${users.length}\n\n`
  
  output += '--- Full User List with Location Check ---\n'
  users.forEach(u => {
    const isIndore = Math.abs(u.lat - 22.7) < 0.5 && Math.abs(u.lng - 75.8) < 0.5
    const isJaipur = Math.abs(u.lat - 26.9) < 0.5 && Math.abs(u.lng - 75.7) < 0.5
    
    let city = 'Other'
    if (isIndore) city = 'Indore'
    else if (isJaipur) city = 'Jaipur'
    
    output += `[${city}] ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Lat: ${u.lat}, Lng: ${u.lng}\n`
  })

  const notIndore = users.filter(user => {
    const isIndore = Math.abs(user.lat - 22.7) < 0.5 && Math.abs(user.lng - 75.8) < 0.5
    return !isIndore
  })

  if (notIndore.length > 0) {
    output += '\nCONCLUSION: There are demo accounts not from Indore.\n'
  } else {
    output += '\nCONCLUSION: All demo accounts are from Indore.\n'
  }
  
  fs.writeFileSync('db_check_results.txt', output)
  console.log('Results written to db_check_results.txt')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
