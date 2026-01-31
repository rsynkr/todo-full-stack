import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { hash } from 'crypto';
import prisma from '../prismaclient.js';
const router = express.Router();
router.post("/register",async(req,res)=>{
    //we are recieving the jspn body and destructuring it
    const {username,password} = req.body;
    const hashedpasskey =bcrypt.hashSync(password,10);
   try{
    const user =await prisma.user.create({
        data:{
            username,
            password:hashedpasskey
        }
    })

    
    const tododefaulttext="Hello welcome "

    await prisma.todo.create({
        data:{
            task:tododefaulttext,
            userId:user.id
        }
    })
//why we create a token is to authincate the user cso thatw e know thwt the user is real
    const token = jwt.sign({id:result.lastInsertRowid},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.json({token});//sending the token to the user
    

   }
   catch(err){
    console.log("Registration error:", err.message);
    console.log("Full error:", err);
    res.status(500).json({message: err.message});
   }
})




router.post("/login",async(req,res)=>{
    const {username,password}=req.body
    try{


        const user=await prisma.user.findUnique({
            where:{
                username:username
            }
        })
        if(!user){ return res.status(404).send({message:"user not found"})}
        const ispasswordvalid=bcrypt.compareSync(password,user.password);  
        if(!ispasswordvalid){ return res.status(401).send({message:"invalid password"})}
       

        const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});//sending the token to the user
    }
    catch(err){

        console.log(err.message);
        res.sendStatus(503);
     }
})

export default router;