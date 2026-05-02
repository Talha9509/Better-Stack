import type {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

const secret=process.env.JWT_SECRET
declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    const header= req.headers.authorization;
    if(!header){
        return res.status(403).json({message:"Unauthorized"})
    }
    
    try {
        const token= jwt.verify(header, secret!)
        req.userId=token.sub as string
        next()
    } catch (error) {
        return res.status(403).json({message:"Unauthorized"})
    }
}