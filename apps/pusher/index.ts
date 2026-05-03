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
    await xAddBulk(websites.map(w=>({
        url:w.url,
        id:w.id
    })))

}

setInterval(() => {
    main()
}, 30 * 60 * 1000);