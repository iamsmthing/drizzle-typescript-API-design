import express, {Request, Response} from 'express';

import taskRouter from './routes/task'
import {createNewUser,signIn} from '../auth/user'
import { shield } from '../auth/auth';
import  'dotenv/config';
const app=express();
const port=process.env.PORT
app.use(express.json());
app.get('/',(req:Request,res:Response)=>{
    res.send('hello world')
})
app.use('/api',shield,taskRouter)
app.use('/user',createNewUser)
app.use('/signin',signIn)


app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})