const mongoose=require("mongoose");
const mailSender = require("../util/mailSender");

const otpTemplate=require("../mail/templates/emailVerificationTemplate")

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

// to send emails
async function sendVerificationEmail(email,otp){
    try {
        const mailResponse=await mailSender(email,"Verification Email from StudyNotion", otpTemplate(otp));
        console.log("email sent successfully", mailResponse);
    } catch (error) {
        console.log("error in sending mail"+error);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports=mongoose.model("OTP",OTPSchema);