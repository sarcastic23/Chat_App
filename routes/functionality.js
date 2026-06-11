const express = require('express');
const router = express.Router();
const { Registered,Message} = require('../db');
const {verifyToken} = require('./login')

router.get('/users',verifyToken, async (req,res)=>{
const users=await Registered.find()
res.json({data:users})
})//get registred users

router.post('/msg/:email',verifyToken ,async (req,res)=>{
const email=req.params.email
const user=req.user.email
const msg =req.body

const message=new Message({userName:user,
    msg:msg['msg'],
    sendTo:email
});

try {
await message.save();
res.status(201).json({ message: 'Message sent' });
} catch (err) {
res.status(500).json({ error: err.message });
}

});//msg registred users after loged in

router.get('/msg', verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const messages = await Message.distinct("userName", { sendTo: email });
    return res.status(200).json({ messages });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}); //see which accs msged u

router.get('/msg/:email',verifyToken, async (req,res)=>{
try{
const senderEmail=req.params.email
const receiverEmail=req.user.email

const received_messages = await Message.find(
  { userName: senderEmail, sendTo: receiverEmail },
  { msg: 1, _id: 0, createdAt: 1 }
).sort({ createdAt: 1 });

const sent_message = await Message.find(
  { userName: receiverEmail, sendTo: senderEmail },
  { msg: 1, _id: 0, createdAt: 1 }
).sort({ createdAt: 1 });

res.status(200).json({sender_message:received_messages,receiver_messages:sent_message,sentBy:senderEmail})

}
catch(err){
    res.status(400).json({error:err.message})
}
}); // see what msgs someone did to u 






module.exports=router