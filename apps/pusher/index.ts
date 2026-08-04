import { prismaClient } from 'store/client'
import { Client } from '@upstash/qstash'

const qstash = new Client({ token: process.env.QSTASH_TOKEN! })

const WORKER_ENDPOINTS = [
  { regionId: "e4a4fb9d-291b-45f6-8bdd-597d90a9301a", url: process.env.INDIA_WORKER_LAMBDA_URL! },
  { regionId: "822c3c19-6ea2-4e35-9261-64ffe24bf93a", url: process.env.USA_WORKER_LAMBDA_URL! }
]

async function main() {
  const websites = await prismaClient.website.findMany({
    select: { url: true, id: true }
  })
  console.log(JSON.stringify(websites))

  for (const website of websites) {
    for (const endpoint of WORKER_ENDPOINTS) {
      await qstash.publishJSON({
        url: endpoint.url,
        body: {
          websiteId: website.id,
          url: website.url,
          regionId: endpoint.regionId
        }
      })
    }
  }
}

setInterval(() => {
  main()
}, 8* 1000);