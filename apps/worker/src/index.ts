import { prismaClient } from 'store/client'
import { Receiver } from '@upstash/qstash'
import axios from 'axios'

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!
})

const instance = axios.create({ timeout: 10000 })

instance.interceptors.request.use((config) => {
  (config as any).metadata = { startTime: performance.now() };
  return config;
});

instance.interceptors.response.use((response) => {
  const endTime = performance.now();
    const startTime = (response.config as any).metadata.startTime;
    (response as any).duration = endTime - startTime;
    return response;
}, (error) => {
  error.config.metadata.endTime = performance.now();
  error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
  return Promise.reject(error);
});

export const handler = async (event: any) => {
  const signature = event.headers['upstash-signature'] || event.headers['Upstash-Signature']
  const isValid = await receiver.verify({ signature, body: event.body }).catch(() => false)

  if (!isValid) {
    console.log("Invalid")
    return { statusCode: 401, body: 'Unauthorized' }
  }

  const { websiteId, url, regionId } = JSON.parse(event.body)

  try {
    const res = await instance.get(url);
    const exactDurationMs = Math.round((res as any).duration);
    
    await prismaClient.websiteTick.create({
      data: {
        response_time_ms:  exactDurationMs,
        status: 'Up',
        region_id: regionId,
        website_id: websiteId
      }
    })
  } catch (error: any) {
    const exactDurationMs = error.duration ? Math.round(error.duration) : 0;
    await prismaClient.websiteTick.create({
      data: {
        response_time_ms: exactDurationMs,
        status: 'Down',
        region_id: regionId,
        website_id: websiteId
      }
    })
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) }
}



