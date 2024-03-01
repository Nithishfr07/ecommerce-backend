const productCategory=require('../models/productCategoryModel')
const asyncHandler=require('express-async-handler')
// const validateMongoDbId=require('../utils/validateMongodbid')

const createProductCategory=asyncHandler(async(req,res)=>
{   
    const title=req.body.title;
    const findCategory= await productCategory.findOne({title:title})
    console.log(findCategory)
    if(!findCategory)
    {   
        const newCategory= await productCategory.create(req.body);
        res.json(newCategory)
    }
    else
    {
        throw new Error("Category Alraedy Exists")
    }
})

const getAllCategory=asyncHandler(async(req,res)=>
{
    try
    {
        const allCategory=await productCategory.find();
        res.json(allCategory)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const getAcategory=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
        const oneCategory=await productCategory.findById(id);
        res.json(oneCategory)
    }
    catch(err)
    {
        throw new Error(err)
    }

})
const updateCategory=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
        const oneCategory=await productCategory.findByIdAndUpdate(id,req.body,{new:true});
        res.json(oneCategory)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const deleteCategory=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
        const oneCategory=await productCategory.findByIdAndDelete(id);
        res.json(oneCategory)
    }
    catch(err)
    {
        throw new Error(err)
    }
})
module.exports={createProductCategory,getAllCategory,getAcategory,deleteCategory,updateCategory}