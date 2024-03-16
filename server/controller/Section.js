const Section=require("../models/Section");
const Course=require("../models/Course");

exports.createSection=async(req,res)=>{
    try {
        //data fetch
        const {sectionName,CourseId}=req.body;
        if(!sectionName || !CourseId){
            return res.status(401).json({
                success:false,
                message:'Enter full details'
            })
        }
        //create section
        const newSection=await Section.create({sectionName});
        console.log("newsection"+newSection);
        //update course with section objectid
        const updatedCourseDet=await Course.findByIdAndUpdate({_id:CourseId},{
            $push:{
                CourseContent:newSection._id
            }
        },{new:true}) //TODO populate to replace sections/subsection in the updatedcoursedet
        console.log("updated"+updatedCourseDet);
        //return response
        return res.status(200).json({
            success:true,
            message:'section created successfully',
            updatedCourseDet,
            newSection
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error during creating section'
        })
    }
}

exports.updateSection=async(req,res)=>{
    try {
        //data fetch
        const {sectionName,SectionId}=req.body;
        if(!sectionName || !SectionId){
            return res.status(401).json({
                success:false,
                message:'Enter full details'
            })
        }
        //update section
        const newSection=await Section.findByIdAndUpdate({_id:SectionId},{sectionName},{new:true});

        //return response
        return res.status(200).json({
            success:true,
            message:'section updated successfully',
            newSection
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error during updating section'
        })
    }
}

exports.deleteSection=async(req,res)=>{
    try {
        //data fetch - using params
        //const {SectionId}=req.params;
        const {SectionId}=req.body;
        if(!SectionId){
            return res.status(401).json({
                success:false,
                message:'Enter full details'
            })
        }
        //delete section
        await Section.findByIdAndDelete(SectionId);
        await Course.findByIdAndDelete(SectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:'section deleted successfully',
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error during deleting section'
        })
    }
}