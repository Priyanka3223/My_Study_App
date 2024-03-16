const express=require("express");
const router=express.Router();

const {createCourse,showAllCourses,getCourseDetails}=require("../controller/Course");
const {createSection,updateSection,deleteSection}=require("../controller/Section");
const {createRating,getAverageRating,getAllRating}=require("../controller/RatingAndReview");
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");
const {categoryPageDetails,showAllCategory,createCategory}=require("../controller/Category");
const {createSubSection}=require("../controller/Subsection")

router.post("/createCourse",auth,isInstructor,createCourse);
router.post("/showAllCourses",showAllCourses);
router.post("/getCourseDetails",auth,getCourseDetails);
router.post("/createSection",auth,isInstructor,createSection);
router.post("/updateSection",auth,isInstructor,updateSection);
router.post("/deleteSection",auth,isInstructor,deleteSection);
router.post("/createSubsection",auth,isInstructor,createSubSection);
router.post("/createCategory",auth,isAdmin,createCategory);
router.get("/showAllCategory",showAllCategory);
router.post("/categoryPageDetails",categoryPageDetails);
router.post("/createRating",auth,isStudent,createRating);
router.get("/getAvgRating",getAverageRating);
router.get("/getAllRating",getAllRating);

module.exports=router;