import express from 'express'
import {prismaClient} from 'store/client'

const app=express()

app.post("/website",(req,res)=>{
    console.log("Hello via Bun!");
    res.send("hi")
})

app.listen(process.env.PORT,()=>{
    console.log(`Running on ${process.env.PORT}`)
})
