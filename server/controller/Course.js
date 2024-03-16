const Course=require("../models/Course");
const Tag=require("../models/Category");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../util/imageUploader")

exports.createCourse=async (req,res)=>{
    try {
        const {courseName,courseDescription,whatYouWillLearn,price,category}=req.body;
        const thumbnail=req.files.thumbnailImage;
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success:false,
                message:'Incomplete data'
            })
        }
        //check for instructor TODO: chk userid and instructorDetails._id are same or diff
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:'instructor details not found'
            })
        }
        // check given tag is valid or not
        const tagDetails=await Tag.findById(category);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:'tag details not found'
            })
        }

        //upload image to cloudinary
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        
        //create an entry for new course
        const newCourse=await Course.create({
            courseName, courseDescription, instructor:instructorDetails._id,
            whatYouWillLearn, price,category:tagDetails._id,
            thumbnail:thumbnailImage.secure_url
        })
        //add the new course to the user schema of instructor
        const updateddate=await User.findByIdAndUpdate({_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },{new:true});
        //update the tag ka schema {chk this}
        await Tag.findByIdAndUpdate({_id:category},{
            $push:{
                course:newCourse._id
            }
        },{new:true})
        //return response
        return res.status(200).json({
            success:true,
            message:'course created successfully'
        })
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'error in creating course'
        })
    }
}

//getallCourses handler function

exports.showAllCourses=async (req,res)=>{
    try {
        const allCourse=await Course.find({},{courseName:true,price:true,thumbnail:true,instructor:true,ratingAndReviews:true,studentsEnrolled:true})
        .populate("instructor").exec();
        return res.status(200).json({
            success:true,
            message:'All courses returned successfully',
            allCourse,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in showing all courses'
        })
    }
}

//get course detain

exports.getCourseDetails=async (req,res)=>{
    try {
        const {courseId}=req.body;
        const courseDetails=await Course.find({_id:courseId})
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails"
            }
        })
        // .populate("category")
        // .populate("ratingAndreviews")
        .populate({
            path:"CourseContent",
            populate:{
                path:"subSection",
            }
        })
        .exec();
        console.log(courseDetails);
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:'could not find the course with courseId'
            })
        }
        return res.status(200).json({
            success:true,
            message:'course details fetched',
            courseDetails
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in showing all course details'
        })
    }
}