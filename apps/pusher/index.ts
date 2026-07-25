import {prismaClient} from 'store/client'
import {xAddBulk} from 'redis-streams/client'

async function main() {
    const websites= await prismaClient.website.findMany({
        select:{
            url:true,
            id:true
        }
    })

    console.log(websites)
    await xAddBulk(websites.map(website=>({
        url:website.url,
        id:website.id
    })))

}

setInterval(() => {
    main()
}, 100 * 1000);