import express from 'express';
import db from "../db.js"
import prisma from '../prismaclient.js';
const router = express.Router();

// Get all todos for logged-in user
router.get('/',async (req, res) => {
    const todos=await prisma.todo.findMany({
        where:{userId:req.userId}
    })
    res.json(todos)
})

// Create a new todo
router.post('/',async (req, res) => {
    const { task } = req.body
    const todo=await prisma.todo.create({
        data:{task,userId:req.userId}
    })

    res.json({ id: result.lastInsertRowid, task, completed: 0 })
})

router.put("/:id",async(req,res)=>{
    const {completed}=req.body;
    const {id}=req.params;
    const {page}=req.query

    const updatedTodo = await prisma.todo.update({
        where:{
            id:parseInt(id),
            userId:req.userId
        },
        data:{
            completed:!!completed
        }
    })
    res.json(updatedTodo);


})

router.delete("/:id",async(req,res)=>{
    const {id}=req.params;
    const userId=req.userId;

    await prisma.todo.delete({
        id:parseInt(id),
        userId:req.userId
    })
   
    res.json({message:"Todo deleted successfully"})



})


export default router;