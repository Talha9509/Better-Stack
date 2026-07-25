import { prismaClient } from 'store/client'
import { xAckBulk, xReadGroup, xGroupCreate } from 'redis-streams/client'

const CONSUMERGROUPREGION = "india-1"
const REGION_ID = "e4a4fb9d-291b-45f6-8bdd-597d90a9301a"

async function main() {
    const createGroup = await xGroupCreate(CONSUMERGROUPREGION);
    console.log("group "+createGroup)

    while (1) {
        const response = await xReadGroup(CONSUMERGROUPREGION, REGION_ID);

        if (!response) {
            continue;
        }

        let promises = response.map(({ message }) => fetchWebsite(message.id, message.url))
        await Promise.all(promises);
        console.log(promises.length);

        xAckBulk(CONSUMERGROUPREGION, response.map(({ id }) => id));
    }
}

async function fetchWebsite(websiteId: string, url: string) {
    return new Promise<void>(async (resolve, reject) => {
        const startTime = Date.now()
        try {
            const res: any = await fetch(url, { method: 'GET' })
            if (res.ok) {
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




