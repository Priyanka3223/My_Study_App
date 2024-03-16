require("dotenv").config();
const User=require("../models/User");
const mailSender=require("../util/mailSender");
const bcrypt=require("bcrypt");
const crypto=require("crypto")

// reset password token
exports.resetPassToken=async(req,res)=>{
    try {
        //get email from req body
        const {email}=req.body;
        //check user for this email, email validation
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:'email has not registered yet'
            })
        }
        //generate token
        const token=crypto.randomUUID();
        //update user by adding token and expiration time
        const updatedDetails=await User.findOneAndUpdate({email:email},{token:token, resetPasswordExpires:Date.now()+5*60*1000},{new:true}) // new se updated document return hota h
        //create url
        const url=`http://localhost:3000/update-password/${token}`;
        //send mail containing url
        await mailSender(email,'password reset link',url);
        //return response
        return res.status(200).json({
            success:true,
            message:'email sent successfully'
        })
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'error during reset password token'
        })
    }
}

//reset password
exports.resetPassword=async(req,res)=>{
    try {
        //fetch data
        const {password,confirmPassword,token}=req.body;
        //validate
        if(password!=confirmPassword){
            return res.status(401).json({
                success:false,
                message:'password not matching'
            })
        }
        //get user details from db using token
        const userDetails=await User.findOne({token:token});
        // if no entry - invalid token or token time check
        if(!userDetails){
            console.log("token invalid")
            return res.status(401).json({
                success:false,
                message:'token invalid'
            })
        }
        if(userDetails.resetPasswordExpires>Date.now()){
            return res.status(401).json({
                success:false,
                message:'link expires'
            })
        }
        //hash pwd
        const hashedP=await bcrypt.hash(password,10);
        // passrd update
        await User.findOneAndUpdate({token:token},{password:hashedP},{new:true})
        //return response
        return res.status(200).json({
            success:true,
            message:'Password reset hogya'
        })
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'error in reset password'
        })
    }
}