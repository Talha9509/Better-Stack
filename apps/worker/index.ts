import { prismaClient } from 'store/client'
import { Receiver } from '@upstash/qstash'

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!
})

export const handler = async (event: any) => {
  const signature = event.headers['upstash-signature'] || event.headers['Upstash-Signature']
  const isValid = await receiver.verify({ signature, body: event.body }).catch(() => false)

  if (!isValid) {
    console.log("Invalid")
    return { statusCode: 401, body: 'Unauthorized' }
  }

  const { websiteId, url, regionId } = JSON.parse(event.body)

  const startTime = Date.now()
  try {
    const res = await fetch(url, { method: 'GET' })
    console.log(res)
    const endTime = Date.now()
    
    await prismaClient.websiteTick.create({
      data: {
        response_time_ms: endTime - startTime,
        status: res.ok ? 'Up' : 'Down',
        region_id: regionId,
        website_id: websiteId
      }
    })
  } catch (error) {
    const endTime = Date.now()
    await prismaClient.websiteTick.create({
      data: {
        response_time_ms: endTime - startTime,
        status: 'Down',
        region_id: regionId,
        website_id: websiteId
      }
    })
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) }
}



