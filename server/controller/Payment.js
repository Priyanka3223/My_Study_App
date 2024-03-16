const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../util/mailSender");
// const {courseEnrollmentEmail}=require("../mail/templated/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the razorpay order
exports.capturePayment=async(req,res)=>{
    //get courseId and UserId
    const userId=req.user.id;
    const {courseId}=req.body;
    // validation
    if(!courseId){
        return res.status(401).json({
            success:false,
            message:'provide valid course id'
        })
    }
    let course;
    try {
        course=await Course.findById(courseId);
        if(!course){
            return res.status(401).json({
                success:false,
                message:'Could not find the course'
            })
        }
        //user already pay for same course or not
        const uid=new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:'student is already enrolled'
            })
        }
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'error in finding course'
        })
    }
    //order create
    const amount=course.price;
    const currency="INR";
    const options={
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId,
            userId
        }
    };
    try {
        //initiate the payment using razorpay
        const paymentResponse=await instance.orders.create(options);
        console.log(paymentResponse);
        // return response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        })
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'error in creating payment'
        })
    } 
}

//verify signature of Razorpay and server
exports.verifySignature=async(req,res)=>{
    const webhookSecret="12345678";
    const signature=req.headers["x-razorpay-signature"];
    const shasum=crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex");
    if(signature===digest){
        console.log("payment is authorised");
        const {courseId,userId}=req.body.payload.payment.entity.notes;
        try {
            //fulfill the action
            //find the course and enroll the student in it
            const enrolledCourse=await Course.findOneAndUpdate({_id:courseId},{
                $push:{
                    studentsEnrolled:userId
                }
            },{new:true});
            if(!enrolledCourse){
                return res.status(401).json({
                    success:false,
                    message:'Course not found'
                })
            }
            //find the student and add the course in student course list
            const student=await User.findOneAndUpdate({_id:userId},{
                $push:{
                    courses:courseId
                }
            },{new:true});
            console.log(student);
            //mail send krdo confirmation wala
            await mailSender(student.email,"Congrats, you are onboarded","course link");
            return res.status(200).json({
                success:true,
                message:'Signature verified'
            })
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:'error in verifying signature payment'
            })
        }
    }
    else{
        return res.status(400).json({
            success:false,
            message:'invalid request'
        })
    }
}

//sendPaymentSuccessEmail
exports.sendPaymentSuccessEmail=async(req,res)=>{
    try {
        const userId=req.user.id;
        if(!userId){
            return res.status(400).json({
                success:false,
                message:'all fields require'
            })
        }
        const enrolledStudent=await User.findById(userId);
        await mailSender(enrolledStudent.email,"payment successfull","congrats");
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'error during email sending payment successfull wali'
        })
    }
}