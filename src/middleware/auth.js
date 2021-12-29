// const jwt=require("jsonwebtoken");
// const Users=require('../models/user');

// const auth=async(req,res,next)=>{
//     try{
//         const token=req.user.jwt;
//         const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
//         console.log(verifyUser);
     
//         const user=await Users.findOne({_id:verifyUser._id})
//         console.log(user)
//         next();
//     }catch(error){
//         res.status(401).send(error)
//     }
// }
// module.exports=auth;

const jwt = require('jsonwebtoken')
// const { JWT_SECRET } = require('../config/key')
// const mongoose = require('mongoose')
var mongoose = require('mongoose');
// const User = mongoose.model("User")
const User=require("../models/user")

module.exports = async(req, res, next) => {
try {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "you must be logged in" })
    }
    const token=await jwt.verify(authorization,process.env.SECRET_KEY);
     console.log(token)
     if(token==null || typeof token== undefined){
        return res.status(401).json({ error: "Unauthorized access" })
     }
    if(token === 'undefined' ||  token._id ==='undefined'){
        req.currentuser=null;
        return next();
    }
    const { _id } = token;
    const user = await User.findOne({_id:_id })
    if(!user || !user._id){
        req.currentuser=null;
        return next();
    }
    req.currentuser=user;
    return next();
    
} catch (error) {
    console.log("authorization error",error)
    req.currentuser=null;
    return next();
}
    
} 