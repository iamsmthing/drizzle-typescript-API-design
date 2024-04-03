import db from './drizzle';
import {  tasks,users } from './schema';
import { and, asc,eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import {Request, Response } from 'express';
export const getTasks = async (req:any,res:Response) => {

 try {
    const {id}=req.user;
    
    const getAllTasks=await db.query.users.findFirst({where:(users, { eq }) => (eq(users.id, id)),with: {tasks: true},columns:{id:true,name:true,email:true}});
    console.log(id)
    res.json(getAllTasks);
    
 } catch (error) {
    console.log(error)
    res.status(500)
    res.json(error)
    
 }

    
}

export const getTask = async (req:any,res:Response) => {
    try {
        const {id}=req.user;
        const task=await db.select().from(tasks).where(and(eq(tasks.userId, id),eq(tasks.id, req.params.id)));
        
        if(!task.length){
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        
    }
    
  


    
}

export const addTask = async (req:any,res:Response) => {

    const {title,description}=req.body;
    const {id}=req.user;
   
    try {
    if(!title){
        return res.status(400).json({ error: 'Title is required' });
    }
    if(!description){
        return res.status(400).json({ error: 'Description is required' });

    } 
    if(!id){
        return res.status(400).json({ error: 'User id is required' });
    }
    const task = await db
        .insert(tasks)
        .values({id: uuidv4(), title: req.body.title, description: req.body.description, isCompleted: req.body.completed, userId: id})
        .returning();
    res.json(task);
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        
    }



    
}


export const updateTask = async (req:any,res:any) => {
    const {title,description,completed}=req.body;
    const {id}=req.user;
    const taskId=req.params.id;
    try {
        const checkIfTaskExists = await db.select().from(tasks).where(and(eq(tasks.id, taskId),eq(tasks.userId, id)));
        console.log(checkIfTaskExists)
        if (!checkIfTaskExists.length) {
            return res.status(404).json({ error: 'Task not found' });
        }
    
       const task=await db.update(tasks).set({title: title, description: description, isCompleted: completed }).where(and(eq(tasks.id,taskId),eq(tasks.userId, id))).returning();
       console.log(task)
       res.json(task);
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        
    }
   
}


export const deleteTask = async (req:any,res:Response) => {
    const taskId=req.params.id;
    const {id}=req.user;
    try {
        const checkIfTaskExists = await db.select().from(tasks).where(and(eq(tasks.id, taskId),eq(tasks.userId, id)));
        if(!checkIfTaskExists.length){
            return res.status(404).json({ error: 'Task not found' });
        }
        const task=await db.delete(tasks).where(and(eq(tasks.id, req.params.id),eq(tasks.userId, id))).returning();
        res.json(task);
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        
    }
    
}

export const deleteAllTasks=async (req:any,res:Response)=>{
    const {id}=req.user;
    try {
        await db.delete(tasks).where(and(eq(tasks.userId, id))).returning();
        if(!id){
            return res.status(400).json({ error: 'User id is required' });
        }
        res.json("Deleted all tasks")
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        
    }
    

}