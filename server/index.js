const express=require("express");
const app=express();
const userRoutes=require("./routes/User");
const profileRoutes=require("./routes/Profile");
const paymentRoutes=require("./routes/Payments");
const courseRoutes=require("./routes/Course");

const dotenv=require("dotenv");
dotenv.config();

const database=require("./config/database");
const cookieParser=require("cookie-parser");
const cors=require("cors"); // backend to entertain frontend request
const fileUpload=require("express-fileupload")
const {cloudnairyconnect}=require("./config/cloudinary");

const PORT=process.env.Port || 4000;

database.connect();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

cloudnairyconnect();

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/profile",profileRoutes);

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your app is running"
    })
})

app.listen(PORT,()=>{
    console.log("App is running at 4000")
})

