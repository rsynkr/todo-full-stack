import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { hash } from 'crypto';

const router = express.Router();
router.post("/register",(req,res)=>{
    //we are recieving the jspn body and destructuring it
    const {username,password} = req.body;
    const hashedpasskey =bcrypt.hashSync(password,10);
   try{
   

    const insertuser=db.prepare(` INSERT INTO users (username,password) VALUES (?,?)`);
    const result= insertuser.run(username,hashedpasskey);
    const tododefaulttext="Hello welcome "

    const todo=db.prepare(`INSERT INTO todos (user_id,task) VALUES (?,?)`);
    todo.run(result.lastInsertRowid,tododefaulttext);
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




router.post("/login",(req,res)=>{
    const {username,password}=req.body
    try{


        const getuser=db.prepare(`SELECT * FROM users WHERE username=?`);
        const user=getuser.get(username);

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