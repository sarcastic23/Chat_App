const express = require('express');
const router = express.Router();
const { Registered,LogedUsers} = require('../db');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const Secret_Key =process.env.SECRET_KEY;

const verifyToken=(req,res,next)=>{
const authheader=req.headers['authorization']
if (!authheader) return res.status(401).json({ message: 'No token provided' });
const token =authheader.split(' ')[1]
if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
try{

const decoded =jwt.verify(token,Secret_Key);
req.user=decoded;
next();// next() in middlewares 

}catch(err){
  console.log(err)
  res.status(403).json({message:'Invalid token'})
}





}

router.post('/register', async (req, res) => {
  try {
    const user = req.body;
    user.password=await bcrypt.hash(user.password,10)
    const new_user = new Registered(user);
  
    await new_user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
try{
const {email,password}=req.body;
const user = await Registered.findOne({email})

if (!user) return res.status(404).json({ message: 'User not found' });

const match = await bcrypt.compare(password,user.password)

if (!match) return res.status(400).json({message:"invalid credintials"});

const token = jwt.sign(
  { id: user._id, email: user.email },
  Secret_Key,
  { expiresIn: '4d' }
);


return res.json({message:token})

}
catch(err){
 console.log(err)
 return res.status(400).json({error:"error"})
}
});

module.exports={router,verifyToken}