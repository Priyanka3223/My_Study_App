const Subsection=require("../models/SubSection");
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../util/imageUploader");

exports.createSubSection=async(req,res)=>{
    try {
        //data fetch
        const {title,SectionId,timeDuration,description}=req.body;
        //extract file/video
        const video=req.files.videoFile;
        if(!title || !video || !SectionId || !timeDuration || !description){
            return res.status(401).json({
                success:false,
                message:'Enter full details'
            })
        }
        // upload video to cloudinary
        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const subsectionDet=await Subsection.create({
            title,timeDuration,description,
            videoUrl:uploadDetails.secure_url
        });
        //update section with subsection objectid
        const updatedSection=await Section.findByIdAndUpdate({_id:SectionId},{
            $push:{
                subSection:subsectionDet._id
            }
        },{new:true}) // TODO: log updated section here after populate
        //return response
        return res.status(200).json({
            success:true,
            message:'subsection created successfully',
            updatedSection
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error during creating subsection'
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
        const newSection=Section.findByIdAndUpdate(SectionId,{sectionName},{new:true});

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
        //const {SectionId}=req.body;
        const {SectionId}=req.params;
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