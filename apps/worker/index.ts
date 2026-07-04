import { prismaClient } from 'store/client'
import { xAckBulk, xReadGroup, xGroupCreate } from 'redis-streams/client'

const REGION_ID = process.env.a!
const WORKER_ID = process.env.b!
const region = 'e4a4fb9d-291b-45f6-8bdd-597d90a9301a'

async function main() {
    await xGroupCreate(REGION_ID);

    while (1) {
        const response = await xReadGroup(REGION_ID, WORKER_ID);

        if (!response) {
            continue;
        }

        let promises = response.map(({ message }) => fetchWebsite(message.id, message.url))
        await Promise.all(promises);
        console.log(promises.length);

        xAckBulk(REGION_ID, response.map(({ id }) => id));
    }
}

async function fetchWebsite(websiteId: string, url: string) {
    return new Promise<void>(async (resolve, reject) => {
        const startTime = Date.now()
        try {
            const a: any = await fetch(url, { method: 'GET' })
            if (a.ok) {
                const endTime = Date.now()
                await prismaClient.websiteTick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: 'Up',
                        region_id: REGION_ID,
                        website_id: websiteId
                    }
                })
                resolve()
            }
        } catch (error) {
            const endTime = Date.now()
            await prismaClient.websiteTick.create({
                data: {
                    response_time_ms: endTime - startTime,
                    status: 'Down',
                    region_id: REGION_ID,
                    website_id: websiteId
                }
            })
            resolve()
        }

    })
}

main()




