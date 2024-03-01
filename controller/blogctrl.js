const blog=require('../models/blogModel')
const user=require('../models/userModel')
const asyncHandler=require('express-async-handler')
const validateMongoDbId=require('../utils/validateMongodbid')

const createBlog=asyncHandler(async(req,res)=>
{   
    try
    {
        const newBlog=await blog.create(req.body);
        res.json(newBlog)
    }
    catch(err)
    {
        throw new Error(err);
    }
})

const updateBlog=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
    const findBlog=await blog.findByIdAndUpdate(id,req.body,{new:true});
    res.json(findBlog)
    }
    catch(err)
    {
        throw new Error(err)
    }

})

const getAllBlogs=asyncHandler(async(req,res)=>
{
    try
    {
        const allblogs=await blog.find()
        res.json(allblogs)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const getAblog=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
        const oneBlog= await blog.findById(id)
        const updatedBlog=await blog.findByIdAndUpdate(id,
            {
                $inc: {numViews:1}
            },
            {
                new:true
            })
        res.json(updatedBlog)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const deleteBlog=asyncHandler(async(req,res)=>
{   
    const {id}=req.params;
    try
    {
        const blogtodelete=await blog.findByIdAndDelete(id)
        res.json(blogtodelete)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const likeBlog=asyncHandler(async(req,res)=>
{
    const {id}=req.body;
    validateMongoDbId(id)
    const oneBlog = await blog.findById(id);
    const {userId}=req.body;
    const isLiked= oneBlog.isLiked
    const alreadyDisliked= blog?.dislikes?.find((useId)=>useId.toString()===userId.toString())
    if(alreadyDisliked)
    {
        const oneBlog=await blog.findByIdAndUpdate(id,
            {
                $pull:{dislikes:userId},
                disliked:false
            },
            {
                new:true
            })
    }
    if(isLiked)
    {
        const oneBlog=await blog.findByIdAndUpdate(id,
            {
                $pull:{likes:userId},
                isLiked:false
            },
            {
                new:true
            })
    }
    else
    {
        const oneBlog=await blog.findByIdAndUpdate(id,
            {
                $push:{likes:userId},
                isLiked:true
            },
            {
                new:true
            })
    }
    res.json(oneBlog)
})

const disLikeBlog=asyncHandler(async(req,res)=>
{
    const {id}=req.body;
    validateMongoDbId(id)
    const oneBlog = await blog.findById(id);
    const {userId}=req.body;
    const isdisLiked= oneBlog.disLiked;
    const alreadyliked= blog?.likes?.find((useId)=>useId.toString()===userId.toString())
    console.log(alreadyliked);
    if(alreadyliked)
    {
        const oneBlog=await blog.findByIdAndUpdate(id,
            {
                $pull:{likes:userId},
                isLiked:false
            },
            {
                new:true
            })
    }
    if(isdisLiked)
    {
        const oneBlog=await blog.findByIdAndUpdate(id,
            {
                $pull:{dislikes:userId},
                disLiked:false
            },
            {
                new:true
            })
    }
    else
    {
        const oneBlog=await blog.findByIdAndUpdate(id,
            {
                $push:{dislikes:userId},
                disLiked:true
            },
            {
                new:true
            })
    }
    res.json(oneBlog)
})
module.exports= {
    createBlog,
    updateBlog,
    getAllBlogs,
    getAblog,
    deleteBlog,
    likeBlog,
    disLikeBlog
}