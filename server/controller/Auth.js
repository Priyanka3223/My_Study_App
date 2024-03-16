const User=require("../models/User");
const OTP=require("../models/OTP");
const Profile=require("../models/Profile")
const optGen=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const mailSender = require("../util/mailSender");
require("dotenv").config();
const {emailVerification}=require("../mail/templates/emailVerificationTemplate")

// send otp
exports.sendOTP=async(req,res)=>{
    try {
        const {email}=req.body;

        //check if user already exist
        const chk=await User.findOne({email});
        if(chk){
            return res.status(401).json({
                success:false,
                message:'User already registered'
            })
        }

        //generate otp
        var otp=optGen.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        
        //check unique otp or not
        var result=await OTP.findOne({otp:otp}); //const
        while(result){
            otp=optGen.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            result=await OTP.findOne({otp:otp});
        }

        const optPayload={email,otp};
        //create an entry for otp
        const otpBody=await OTP.create(optPayload);
        res.status(200).json({
            success:true,
            message:'OTP sent successfully',
            otp
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

//signup
exports.signUp=async(req,res)=>{
    try {
        //data fetch from req ki body
        const{
            firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp
        }=req.body;

        //validate krlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }
        // 2 password match krlo
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:'Password and confirmpassword does not match'
            })
        }
        //check user already exist or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already registered'
            })
        }
        //find most recent otp stored for user
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        
        //validate otp
        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:'otp not found'
            })
        }else if(otp!=recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:'Invalid otp'
            });
        }
        //hash password 
        const hashed=await bcrypt.hash(password,10);
        //entry create in db

        const profile=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })
        const user=await User.create({
            firstName,lastName,email,contactNumber,password:hashed, accountType , additionalDetails:profile, image:`https:api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
        // return res
        return res.status(200).json({
            success:true,
            message:'User is registererd successfully',
            user,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User cannot be registered. please try again'
        })
    }
}

//login
exports.login=async(req,res)=>{
    try {
        // get data from req body
        const {email,password}=req.body;
        // validation data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'All fields required',
            });
        }
        // user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            });
        }
        //generated jwt, after passwrd matching
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token =jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,user,
                message:'Logged in successfully'
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect'
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Login failure'
        })
    }
}

//change password
exports.changePassword=async(req,res)=>{
    try {
        // get data from req body
        const {oldPassword,newPassword,confirmNewPassword}=req.body;
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(403).json({
                success:false,
                message:'All fields required',
            });
        }
        if(oldPassword!=User.password){
            return res.status(403).json({
                success:false,
                message:'Incorrect old password',
            });
        }
        if(newPassword!=confirmNewPassword){
            return res.status(403).json({
                success:false,
                message:'new password does not matches confirm ',
            });
        }
        User.password=newPassword;
        const response=await mailSender(User.email,'Password Updated','password changed');
        return res.status(200).json({
            success:true,
            message:'password changed successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error during password change'
        })
    }
}