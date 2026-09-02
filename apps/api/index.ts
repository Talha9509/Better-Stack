import express from 'express'
import {prismaClient} from 'store/client'
import { AuthInput } from './types'
import jwt from 'jsonwebtoken'
import { authMiddleware } from './middleware'
import cors from 'cors'
import bcrypt from 'bcrypt'
import rateLimit from 'express-rate-limit'

const app=express()
declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}
const PORT = 3001

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND,
  credentials: true
}))

const secret=process.env.JWT_SECRET

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { message: 'Too many attempts, try again later' }
})

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 100,
  message: { message: 'Too many attempts, try again later' }
})

app.post("/api/v1/user/signup", authLimiter, async(req,res)=>{
    const data=AuthInput.safeParse(req.body)
    if(!data.success){
        return res.status(403).json({message:"Invalid Inputs"})
    }

    try {
        const hashed = await bcrypt.hash(data.data.password, 8)
        const user=await prismaClient.user.create({
            data:{
                username:data.data.username,
                password: hashed
            }
        })

        const token=jwt.sign({sub:user.id}, secret!)
        return res.json({jwt:token, id:user.id})

    } catch (error:any) {
        console.log(error)
        if(error.code=='P2002'){
            return res.status(403).json({message:"Username already exists"})
        }
        return res.status(500).json({message:"Internal Server Error"})
    }
})

app.post("/api/v1/user/signin", authLimiter, async(req,res)=>{
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
        const valid = await bcrypt.compare(data.data.password, user.password)
        if(!valid){
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

app.post("/api/v1/website", rateLimiter, authMiddleware, async(req,res)=>{
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

app.get("/api/v1/status/:websiteId", rateLimiter, authMiddleware, async (req,res)=>{
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

app.get("/api/v1/websites", rateLimiter, authMiddleware, async (req, res) => {
    const userId=req.userId
  const websites = await prismaClient.website.findMany({
    where: { user_id: userId! },
    include:{
        ticks:{
            orderBy: [{ createdAt: 'desc' }],
            select:{ response_time_ms: true, status: true, createdAt: true, id: true, region_id: true },
            take: 20
        }
    }
  });
  res.json({ websites });
});

app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`)
})
