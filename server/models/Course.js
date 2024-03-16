const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
    courseName: {
        type:String,
        trim:true
    },
    courseDescription: {
        type:String,
        required:true,
        trim:true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    whatYouWillLearn: {
        type:String
    },
    CourseContent: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    }],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],
    price:{
        type:Number
    },
    thumbnail:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentsEnrolled:[
        {
           type: mongoose.Schema.Types.ObjectId,
           ref:"User",
           required:true
        }
    ]
})

module.exports=mongoose.model("Course",courseSchema);