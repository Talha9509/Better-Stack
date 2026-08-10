import { prismaClient } from 'store/client'
import { Client } from '@upstash/qstash'

const qstash = new Client({ token: process.env.QSTASH_TOKEN! })

const WORKER_ENDPOINTS = [
  { regionId: "c68fc461-9645-472f-b1b2-6818bac36de9", url: process.env.INDIA_WORKER_LAMBDA_URL! },
  { regionId: "822c3c19-6ea2-4e35-9261-64ffe24bf93a", url: process.env.USA_WORKER_LAMBDA_URL! }
]

async function main() {
  try {
    const websites = await prismaClient.website.findMany({
      select: { url: true, id: true }
    })
    console.log(JSON.stringify(websites))
  
    for (const website of websites) {
      for (const endpoint of WORKER_ENDPOINTS) {
        const currentHour = new Date().toISOString().slice(0, 13);
        const queue = await qstash.publishJSON({
          url: endpoint.url,
          deduplicationId: `${website.id}-${endpoint.regionId}-${currentHour}`,
          retries: 1,
          body: {
            websiteId: website.id,
            url: website.url,
            regionId: endpoint.regionId
          }
        })
        console.log(queue)
        console.log(JSON.stringify(queue))
      }
    }
  } catch (error) {
    console.error("Error in pusher cycle, process will NOT exit:", error);
  }
}

setInterval(() => {
  main()
}, 6 * 60 * 60 * 1000);