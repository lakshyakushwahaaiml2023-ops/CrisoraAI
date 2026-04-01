
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('--- Selective Relocation to Indore ---')
  
  // Indore bounds
  const MIN_LAT = 22.2, MAX_LAT = 23.2
  const MIN_LNG = 75.3, MAX_LNG = 76.3
  
  // Indore center for relocation
  const CENTER_LAT = 22.7196
  const CENTER_LNG = 75.8577
  const RANGE = 0.05 // ~5km radius
  
  function getRandomIndore() {
    return {
      lat: CENTER_LAT + (Math.random() - 0.5) * RANGE,
      lng: CENTER_LNG + (Math.random() - 0.5) * RANGE
    }
  }

  function isNotIndore(lat, lng) {
    return lat < MIN_LAT || lat > MAX_LAT || lng < MIN_LNG || lng > MAX_LNG
  }

  // 1. Users
  const users = await prisma.user.findMany()
  for (const user of users) {
    if (isNotIndore(user.lat, user.lng)) {
      const newLoc = getRandomIndore()
      await prisma.user.update({
        where: { id: user.id },
        data: { lat: newLoc.lat, lng: newLoc.lng }
      })
      console.log(`Relocated User [${user.id}] from (${user.lat}, ${user.lng}) to (${newLoc.lat}, ${newLoc.lng})`)
    }
  }

  // 2. NGO Profiles
  const ngos = await prisma.nGOProfile.findMany()
  for (const ngo of ngos) {
    if (isNotIndore(ngo.hq_lat, ngo.hq_lng)) {
      const newLoc = getRandomIndore()
      await prisma.nGOProfile.update({
        where: { id: ngo.id },
        data: { hq_lat: newLoc.lat, hq_lng: newLoc.lng }
      })
      console.log(`Relocated NGO [${ngo.org_name}] from (${ngo.hq_lat}, ${ngo.hq_lng}) to (${newLoc.lat}, ${newLoc.lng})`)
    }
  }

  // 3. Needs
  const needs = await prisma.need.findMany()
  for (const need of needs) {
    if (isNotIndore(need.lat, need.lng)) {
      const newLoc = getRandomIndore()
      await prisma.need.update({
        where: { id: need.id },
        data: { lat: newLoc.lat, lng: newLoc.lng }
      })
      console.log(`Relocated Need [${need.id}] from (${need.lat}, ${need.lng}) to (${newLoc.lat}, ${newLoc.lng})`)
    }
  }

  // 4. Resources
  const resources = await prisma.resource.findMany()
  for (const resource of resources) {
    if (isNotIndore(resource.lat, resource.lng)) {
      const newLoc = getRandomIndore()
      await prisma.resource.update({
        where: { id: resource.id },
        data: { lat: newLoc.lat, lng: newLoc.lng }
      })
      console.log(`Relocated Resource [${resource.item_name}] from (${resource.lat}, ${resource.lng}) to (${newLoc.lat}, ${newLoc.lng})`)
    }
  }

  console.log('\nRelocation complete.')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
