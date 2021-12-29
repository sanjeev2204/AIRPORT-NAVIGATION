const mongoose = require('mongoose')
const multer = require("multer");
var upload = multer({ dest: 'uploads/' });
// const path=require("path");
// const Users = mongoose.model('Users')
const { body, validationResult } = require('express-validator');
var validator = require('validator');
const Users = require('../models/user');
const Wishlists = require('../models/wishList')
// const upload=multer({dest:'./upload/images'})
const bcrypt = require("bcrypt")
const crypto = require("crypto");
require('dotenv').config();
const express = require("express");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const smsKey = process.env.SMS_SECRET_KEY;
const jwt = require("jsonwebtoken");
const { Console } = require('console');




var url = `https://airportnavigation.moreyeahs.in/`;
const AuthController = {
    signup: async (req, res) => {
        try {
            const { name, phonenumber,countryCode, birthday, password } = req.body;
            let filename = req.file.path.replace('\\', '/');
            let image = `${url}${filename}`
            let users = await Users.findOne({ phonenumber })
            if (users) {
                return res.status(201).json({ message: "user already exists" })
            } else {
                const hashedPassword = await bcrypt.hash(password, 12);
                const userobj = { name, phonenumber,countryCode, birthday, password: hashedPassword, image };
                const newUser = new Users(userobj);
                const saveUser = await newUser.save();
                const token = jwt.sign({ _id: saveUser._id }, process.env.SECRET_KEY);
                return res.status(200).json({
                    success: true,
                    message: "user signup successfully",
                    user: {
                        _id: saveUser._id, name: saveUser.name, image: saveUser.image,
                        phonenumber: saveUser.phonenumber,countryCode:saveUser.countryCode, birthday: saveUser.birthday
                    },
                    AccessToken: token
                })
            }
        } catch (err) {
            console.log(err)
            return res.json({ succes: false, err: err })
        }
    },

    login: async (req, res) => {
        try {
            let phonenumber = req.body.phonenumber;
            let password = req.body.password;
            const retUsers = await Users.findOne({ 'phonenumber': phonenumber });
            if (retUsers) {
                // verify password
                const isPasswordCorrect = await bcrypt.compare(password, retUsers.password)
                if (isPasswordCorrect) {

                    const token = jwt.sign({ _id: retUsers._id, name: retUsers.name, phonenumber: retUsers.phonenumber }, process.env.SECRET_KEY);

                    const user = retUsers.toObject();
                    Reflect.deleteProperty(user, 'password');
                    return res.status(200).json({
                        success: true,
                        message: "user login successfully",
                        user,
                        // retUsers,
                        accessToken: token
                    })
                    
                }
                // res.status(200).json({AccessToken:token})

            } else {
                res.status(401).json({ message: "invalid phone no and password" })
                console.log('pass is incorrect')
            }
            //  console.log(isPasswordCorrect);
        }
        // for delete the password from login




        catch (err) {
            console.log(err)
            res.status(500).json({ message: "server error", error: err })
        }

    },

    //get all data
    getAllData: async (req, res) => {
        try {
            const ID = req.currentuser.id;
            const getAll = await Users.find();
            // console.log(get);
            // const user = getAll.toObject();
            // Reflect.deleteProperty(user, 'password'),
            res.status(200).json({
                success: true,
                message: "successfully getting all data..!!!",
                getAllDataOfProject: getAll
            })
        } catch (e) {
            console.log(e)
        }
    },
    //edit/update api
    updateUser: async (req, res) => {
        try {
            const ID = req.currentuser.id;
            let { name, birthday, phonenumber, image } = req.body;
            let data = {};
            if (name) {
                data.name = name
            } else if (birthday) {
                data.birthday = birthday
            }
            else if (phonenumber) {
                data.phonenumber = phonenumber
            } else if (image) {
                data.image = image
            }
            let updates = await Users.findByIdAndUpdate({ _id: ID }, { $set: data })
            let userResponse = await Users.findOne({ _id: ID })
            let user = userResponse.toObject();
            Reflect.deleteProperty(user, 'password'),
                res.status(200).json({
                    succes: true,
                    message: "updated successfully",
                    user
                })
        } catch (e) {
            console.log(e)
        }
    },

    deleteUser: async (req, res) => {
        try {
            const ID = req.currentuser.id;
            console.log(ID);
            const deleteUser = await Users.findByIdAndDelete({ _id: ID });
            const user = deleteUser.toObject();
            Reflect.deleteProperty(user, 'password'),
                res.status(200).json({
                    success: true,
                    message: "user deleted successfully",
                    userDeails: user

                })
        } catch (e) {
            console.log(e)
            res.status(400).json({
                success: false,
                message: "user already deleted"
            })
        }
    },

    sendOTP: (req, res) => {
        const phone = req.body.phone;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const ttl = 2 * 60 * 1000
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`
        const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex')
        const fullhash = `${hash}.${expires}`

        client.messages.create({
            body: `your one time login password for CFM is ${otp}`,
            // from:+12512206059,
            from: +15076974995,
            to: phone
        }).then((message) => { console.log(message) })
            .catch((err) => { console.log(err) })
        res.status(200).send({ phone, has: fullhash })
    },

    resetPassword: async (req, res, next) => {
        const { newPassword, cNewPassword } = req.body;
        // const {phoneNumber}= req.params.id;

        try {
            //otp verify
            // let isVerified=
            //otp verify end

            //  if(isVerified){
            // let data={};
            // if(newPassword){
            //     data.newPassword=newPassword;
            // }
            // else if(cNewPassword){
            //     data.cNewPassword=cNewPassword;
            // }
            //  if(newPassword==cNewPassword){
            //     let userObj = await User.save();
            //     // const hashedPassword= await bcrypt.hash(password,12);
            //     res.status(200).json({
            //         success:true,
            //         message:'Password changed succesfully',
            //         userObj
            //           })

            //  }else{
            //     res.status(401).json({
            //         success:false,
            //         message:'Password and confirm password do not matched',

            //           })
            //  }

            // res.status(200).json({message:'Password changed succesfully'})

            //  }else{
            //      return res.status(401).json({message:'Invalid otp'})
            //  }

            // actual code  for reference
            // const payload = jwt.verify(resetLink,process.env.JSON_SECURITY_KEY);
            // const user = await User.findOne({_id:payload.id});


            // user.password = newPassword;
            // user.resetLink = ''
            // await user.save();
            // res.status(200).json({message:'Password changed succesfully'})
            const ID = req.currentuser.id;
            if (newPassword === cNewPassword) {
                let phonenumber = req.currentuser.phonenumber
                let user = await Users.findOne({ _id: ID }, { phonenumber })
                await user.save();
                // const user = saveUser.toObject();
                // Reflect.deleteProperty(user, 'password');
                const userData = user.toObject();
                Reflect.deleteProperty(userData, 'password'),
                    res.status(200).json({
                        success: true,
                        message: "Password changed succesfully",
                        //    user,
                        //    AccessToken:token
                        userData
                    })
            }


            else {
                return res.status(401).json({
                    success: false,
                    message: "Password and confirm password do not matched",
                })
            }
        } catch (err) {
            console.log(err);
        }
    },

    // ADD WISH LIST
    SaveWishlist: async (req, res, next) => {
        try {
            const { item } = req.body
            if (!item) {
                return res.status(422).json({ error: "please provide wish list name" })
            }
            const userobj = { item, created_by: req.currentuser };
            const newWishLists = new Wishlists(userobj);
            const saveUser = await newWishLists.save();
            res.status(200).json({
                success: true,
                message: "wishlist added successfully",
                dataDetails: saveUser
            })
        } catch (e) {
            res.status(400).send(e);
        }
    },

    // get all wish list
    GetAllWishList: async (req, res, next) => {
        try {
            let userWishListData = await Users.aggregate([
                {
                    "$lookup":
                    {
                        from: "wishes",
                        localField: "_id",
                        foreignField: "created_by",
                        as: "wishlistData"
                    }
                }, { "$match": { "_id": req.currentuser._id } }, { "$project": { "password": 0, "__v": 0, "createdAt": 0, "updatedAt": 0, "wishlistData.created_by": 0, "wishlistData.createdAt": 0, "wishlistData.updatedAt": 0, "wishlistData.__v": 0 } }
            ]);
            res.json({ success: true, message: "wishlist getting successfully", dataWishList: userWishListData })
        } catch (e) {
            res.send(e)
        }

    },

    // api for delete any wish from wish list
    DeleteWishlist: async (req, res, next) => {
        try {
            console.log(req.params.id);
            const DeleteRequest = await Wishlists.findByIdAndDelete(req.params.id);

            res.status(200).json({
                success: true,
                message: `${DeleteRequest.item} wish deleted successfully from wish list`,
                // DeleteRequest
            });
        } catch (e) {
            res.status(500).send(e);
        }
    },

    UpdateWishlist: async (req, res, next) => {
        try {
            const _id = req.params.id;
            const updateWish = await wishlist.findByIdAndUpdate(_id, req.body);
            res.status(200).json({
                success: true,
                message: "wish updated successfully from wish list",
                updateWish
            })
        } catch (e) {
            res.status(400).send(e)
        }
    }

}




module.exports = AuthController;
