const Category=require("../models/Category");

// create tag ka handler func
exports.createCategory=async (req,res)=>{
    try {
        const {name,description}=req.body;
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:'Incomplete data'
            })
        }
        const tagDetails=await Category.create({
            name:name,
            description:description
        })
        return res.status(200).json({
            success:true,
            message:'category created successfully'
        })
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'error in creating category'
        })
    }
}

//getalltags handler function

exports.showAllCategory=async (req,res)=>{
    try {
        const allTags=await Category.find({},{name:true,description:true});
        console.log(allTags);
        return res.status(200).json({
            success:true,
            message:'All category returned successfully',
            allTags,
        })
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'error in showing all category'
        })
    }
}

// category page details
exports.categoryPageDetails=async(req,res)=>{
    try {
        const { categoryId } = req.body;

		// Get courses for the specified category
		const selectedCategory = await Category.findById(categoryId)          //populate instuctor and rating and reviews from courses
			.populate({path:"course"})
			.exec();
		// Handle the case when the category is not found
		if (!selectedCategory) {
			return res.status(404)
				.json({ success: false, message: "Category not found" });
		}
		// Handle the case when there are no courses
		if (selectedCategory.course.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

		const selectedCourses = selectedCategory.course;

		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		}).populate({path:"course"}).exec()
		

		res.status(200).json({
			success: true,
            data:{
                selectedCourses,
                categoriesExceptSelected
            }
		});
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in fetching category page details'
        })
    }
}