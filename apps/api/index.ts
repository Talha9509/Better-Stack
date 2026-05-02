import express from 'express'
import {prismaClient} from 'store/client'

const app=express()

app.use(express.json())

app.post("/website", async(req,res)=>{
    if(!req.body){
        return res.status(411).json({ message:"Invalid Inputs" })
    }
    const website= await prismaClient.website.create({
        data:{
            url:req.body.url,
            timeAdded:new Date()
        }
    })

    res.json({id:website.id})
})

app.get("/status/:websiteId",(req,res)=>{

})

app.listen(process.env.PORT,()=>{
    console.log(`Running on ${process.env.PORT}`)
})
