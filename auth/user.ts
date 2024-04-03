import db from '../db/drizzle';
import { users } from '../db/schema';
import { asc,eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import {Request, Response } from 'express';
import { comparePassword, generateToken, hashPassword } from './auth';

export const createNewUser=async(req:Request,res:Response)=>{
    const checkIfUserExists = await db.select().from(users).where(eq(users.email, req.body.email));
    if(checkIfUserExists.length){
        return res.status(409).json({ error: 'User already exists' });
    }

    try {

       
        const hash=await hashPassword(req.body.password);
        const user =await db.insert(users).values({id:uuidv4(),name:req.body.name,email:req.body.email,password:hash}).returning();

    console.log(user)
    const token=generateToken({id:user[0].id})
    console.log("token:",token)
    res.json({token:token})
        
    } catch (error) {
        console.log(error)
        res.json(error)
        
    }
    
}

export const signIn=async(req:Request,res:Response)=>{

    try {
        const user =await db.select().from(users).where(eq(users.email, req.body.email));
        if(!user.length){
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await comparePassword(req.body.password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token=generateToken({id:user[0].id})
        return res.json({token:token})
        
    } catch (error) {
        res.json(error)
    }

   
}
