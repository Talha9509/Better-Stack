import express from 'express'
import {prismaClient} from 'store/client'
import { AuthInput } from './types'
import jwt from 'jsonwebtoken'
import { authMiddleware } from './middleware'
import cors from 'cors'

const app=express()
declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND,
  credentials: true
}))

const secret=process.env.JWT_SECRET

app.post("/user/signup", async(req,res)=>{
    const data=AuthInput.safeParse(req.body)
    if(!data.success){
        return res.status(403).json({message:"Invalid Inputs"})
    }

    try {
        const user=await prismaClient.user.create({
            data:{
                username:data.data.username,
                password:data.data.password
            }
        })

        const token=jwt.sign({sub:user.id}, secret!)
        return res.json({jwt:token, id:user.id})

    } catch (error:any) {
        if(error.code=='P2002'){
            return res.status(403).json({message:"Username already exists"})
        }
        return res.status(500).json({message:"Internal Server Error"})
    }
})

app.post("/user/signin", async(req,res)=>{
    const data=AuthInput.safeParse(req.body)
    if(!data.success){
        return res.status(403).json({message:"Invalid Inputs"})
    }
    
    try {
        const user=await prismaClient.user.findFirst({
            where:{
                username:data.data.username,
            }
        })
        if(!user){
            return res.status(403).json({message:"Signup first"})

        }
        if(user?.password!==data.data.password){
            return res.status(403).json({message:"Incorrect Password"})
        }

        const token=jwt.sign({sub:user.id}, secret!)
        return res.json({jwt:token})

    } catch (error:any) {
        if(error.code=='P2002'){
            return res.status(403).json({message:"Username already exists"})
        }
        return res.status(500).json({message:"Internal Server Error"})
    }
})

app.post("/website", authMiddleware, async(req,res)=>{
    const userId=req.userId
    if(!req.body){
        return res.status(411).json({ message:"Invalid Inputs" })
    }
    const website= await prismaClient.website.create({
        data:{
            url:req.body.url,
            timeAdded:new Date(),
            user_id: userId!
        }
    })

    res.json({id:website.id})
})

app.get("/status/:websiteId", authMiddleware, async (req,res)=>{
    const id=req.params.websiteId as string

    try {
        const website= await prismaClient.website.findFirst({
        where:{
            user_id:req.userId,
            id:id
        },
        include:{
            ticks:{
                orderBy:[{createdAt:'desc'}],
                take:1
            }
        }
    })
    if(!website){
        return res.status(409).json({message:"Website Not Found"})
    }
} catch (error:any) {
    if(error.code=='P2002'){
            return res.status(409).json({message:"Website Not Found"})
        }
    return res.status(500).json({message:"Internal Server Error"})
    }
})

app.get("/websites", authMiddleware, async (req, res) => {
    const userId=req.userId
  const websites = await prismaClient.website.findMany({
    where: { user_id: userId! },
    include:{
        ticks:{
            select:{
                response_time_ms:true, status:true, createdAt:true
            }
        }
    }
  });
  res.json({ websites });
});

app.listen(process.env.PORT,()=>{
    console.log(`Running on ${process.env.PORT}`)
})
