const ratingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");

//create rating
exports.createRating=async(req,res)=>{
    try {
        const {userId}=req.user.id;
        const {rating,review,courseId}=req.body;
        // check if user is enrolled or not
        const courseDetails=await Course.findOne({_id:courseId,
        studentsEnrolled:{$elemMatch:{$eq:userId}}})
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'student is not enrolled in the course'
            })
        }
        // check if user has already reviewd
        const chk=await ratingAndReview.findone({user:userId, course:courseId});
        if(chk){
            return res.status(401).json({
                success:false,
                message:'already reviewed'
            })
        }
        // create rating and review
        const ratingAndreview=await ratingAndReview.create({
            rating,review,course:courseId, user:userId
        })
        //updating in course
        const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                ratingAndReviews:ratingAndreview,
            }
        },{new:true})

        console.log(updatedCourseDetails);
        return res.status(200).json({
            success:true,
            message:'rating and review created successfuly'
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in creating rating'
        })
    }
}

//get average rat
exports.getAverageRating=async (req,res)=>{
    try {
        const courseId=req.body.courseId;
        const result=await ratingAndReview.aggregate([
            {$match:{
                course:new mongoose.Types.ObjectId(courseId)
            }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])
        if(result.length>0){
            return res.status(200).json({
                success:true,
                message:'avg rating',
                averageRating:result[0].averageRating
            })
        }
        return res.status(200).json({
            success:true,
            message:"Average rating is 0",
            averageRating:0
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in creating avg rating'
        })
    }
}

//get All ratings
exports.getAllRating=async (req,res)=>{
    try {
        const result=await ratingAndReview.find({})
        .sort({rating:"desc"})
        .populate({
            path:"user",
            select:"firstName lastName email image"
        })
        .populate({
            path:"course",
            select:"courseName"
        }).exec();
        return res.status(200).json({
            success:true,
            message:"all rating fetched",
            data:result
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in creating all rating'
        })
    }
}