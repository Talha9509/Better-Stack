import { createClient } from 'redis'

// const STREAM_NAME='betteruptime:website'
const STREAM_NAME='betteruptime:website';
const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

type WebsiteEvent = {id: string, url:string}
type MessageType = {
    id: string,
    message:{
        id: string,
        url: string
    }
}

export async function xGroupCreate(consumerGroup: string) {
    try {
        const createGroup = await client.xGroupCreate(STREAM_NAME, consumerGroup, '0', {
            MKSTREAM: true
        });
        console.log(createGroup)
    } catch (err: any) {
        if (!String(err?.message).includes('BUSYGROUP')) {
            throw err;
        }
    }
}

async function xAck(consumerGroup:string, eventId:string) {
    await client.xAck(STREAM_NAME,consumerGroup,eventId)
}

export async function xAckBulk(consumerGroup:string, eventIds:string[]) {
    eventIds.map(eventId => xAck(consumerGroup, eventId))
}

export async function xReadGroup(consumerGroup: string, workerId: string): Promise<MessageType[] | undefined> {
    const res = await client.xReadGroup(consumerGroup, workerId, { key: STREAM_NAME, id: '>' },
         { 'COUNT': 5 }
    );

    // @ts-ignore
    let messages: MessageType[] | undefined = res?.[0]?.messages;

    return messages;
}


async function xAdd({id,url}:WebsiteEvent){
    const res = await client.xAdd(STREAM_NAME, '*', {
        url: url,
        id: id
    })
}

export async function xAddBulk(websites: WebsiteEvent[]) {
    for(let i=0; i<websites.length;i++){
        await xAdd({
            id:(websites[i]?.id as string),
            url:(websites[i]?.url as string)
        })
    }
}