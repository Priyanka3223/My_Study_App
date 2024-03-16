const Course = require("../models/Course");
const Profile=require("../models/Profile");
const { findByIdAndUpdate } = require("../models/SubSection");
const User=require("../models/User");

//update profile
exports.updateProfile=async(req,res)=>{
    try {
        // get data
        const {gender,dateOfBirth="",about="",contactNumber}=req.body;
        const id=req.user.id;
        //validate
        if(!gender || !contactNumber || !id){
            return res.status(401).json({
                success:false,
                message:'Enter all the details'
            })
        }
        //find and update profile
        const userDetails=await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();
        //return res
        return res.status(200).json({
            success:true,
            message:'updated profile successfully',
            profileDetails
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in updating profile'
        })
    }
}

exports.deleteAccount=async(req,res)=>{
    try {
        // get data
        const id=req.user.id;
        //validate
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:'User not found'
            })
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        
        //TODO: unenroll user from all enrolled courses
        await Course.findByIdAndDelete({_id:id}).populate("studentsEnrolled").exec();
        
        await User.findByIdAndDelete({_id:id});
        
        //return res
        return res.status(200).json({
            success:true,
            message:'deleted profile successfully',
            profileDetails
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in deleting profile'
        })
    }
};

exports.getAllUserDetails=async(req,res)=>{
    try {
        const id=req.user.id;
        const userDetails=await User.findById(id).populate("additionalDetails").exec();
        return res.status(200).json({
            success:true,
            message:'User data fetched successfully',
            userDetails
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in fetching all user details'
        })
    }
}