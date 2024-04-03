import { Router, Request, Response } from 'express';
import { Task } from '../models/task';
import { body,validationResult } from 'express-validator';
const router = Router();

import {addTask,deleteAllTasks,deleteTask,getTask,getTasks,updateTask} from '../../db/routeHandlers'
let tasks: Task[] = [];

const taskValidationRules=[
    body('title').notEmpty().withMessage('Title is required').isLength({min:3}).withMessage('Title must be at least 3 characters long'),
    body('description').notEmpty().withMessage('Description is required').isLength({min:3}).withMessage('Description must be at least 3 characters long'),
    body('completed').isBoolean().withMessage('Completed must be a boolean value').optional(),
]

// Add your CRUD API implementation here

const handleInputErrors=(req:Request,res:Response,next:Function)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}

  router.post('/',taskValidationRules,handleInputErrors,addTask)

  router.get('/', getTasks);

  router.get('/:id',getTask);

  router.put('/:id', taskValidationRules,handleInputErrors,updateTask);

  router.delete('/:id', deleteTask);

  router.delete('/',deleteAllTasks)
export default router;