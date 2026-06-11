
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

const userSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const registred= new mongoose.Schema({
 name: {type: String,required:true},
 email:{type:String,required:true,unique:true},
 password:{type:String,required:true}


})

const login_info= new mongoose.Schema({
 email:{type:String,required:true,unique:true},
 password:{type:String,required:true}
})

const message = new mongoose.Schema({
  userName: { type: String, required: true },
  msg: { type: String, required: true },
  sendTo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Registered = mongoose.model('Registered', registred);
const LogedUsers = mongoose.model('Logged',login_info)
const Message=mongoose.model('Message',message)

module.exports = { User, Registered,LogedUsers,Message};