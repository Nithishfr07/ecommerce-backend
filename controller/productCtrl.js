// const { query } = require('express')
const product=require('../models/productModel')
const asyncHandler=require('express-async-handler')
const slugify=require('slugify')
const user=require('../models/userModel')
const validateMongoDBid = require('../utils/validateMongodbid')
const userModel = require('../models/userModel')

const createProduct=asyncHandler(
    async(req,res)=>
    {   
        if(req.body.title)
        {
            req.body.slug=slugify(req.body.title)
        }
        try
        {   
            console.log("Hi")
            const newProduct=await product.create(req.body)
            res.json(newProduct)
        }
        catch(err)
        {
            throw new Error(err)
        }
    }
)

const getallproducts=asyncHandler(
    async(req,res)=>
    {   
        // filtering
        const queryObj={...req.query}
        const excludeFields=['sort','limit','page','fields']
        excludeFields.forEach(el=>delete queryObj[el])
        let queryStr=JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`)
        let query=product.find(JSON.parse(queryStr))

        //sorting
        if(req.query.sort)
        {
            const sortQuery= req.query.sort.split(',').join(" ")
            query=query.sort(sortQuery)
        }
        else
        {
            query=query.sort('-createdAt')
        }
        // limiting the fields
        if(req.query.fields)
        {
            const fields= req.query.fields.split(',').join(" ")
            query=query.select(fields)
        }
        else
        {
            query=query.select('-__v')
        }

        //pagination
        const page=req.query.page
        const limit=req.query.limit
        const skip=(page-1) * limit
        query=query.skip(skip).limit(limit)
        if(req.query.page)
        {
            const productCount=await product.countDocuments()
            if(skip>=productCount)
            {
                throw new Error("the page does not exists")
            }
        }

        try
        {
            const allProducts=await query
            res.json(allProducts)
        }
        catch(err)
        {
            throw new Error(err)
        }
    }
)

const getaproducts=asyncHandler(
    async(req,res)=>
    {   
        const {id}=req.params
        try
        {
            const oneProducts=await product.findById(id)
            res.json(oneProducts)
        }
        catch(err)
        {
            throw new Error(err)
        }
    }
)

const updateproducts=asyncHandler(
    async(req,res)=>
    {   
        if(req.body.title)
        {
            req.body.slug=slugify(req.body.title)
        }
        const {id}=req.params
        try
        {
            const updatedProducts=await product.findByIdAndUpdate(id,req.body,{new:true})
            res.json(updatedProducts)
        }
        catch(err)
        {
            throw new Error(err)
        }
    }
)

const deleteproducts=asyncHandler(
    async(req,res)=>
    {   
        const {id}=req.params
        try
        {
            const deletedProducts=await product.findByIdAndDelete(id)
            res.json(deletedProducts)
        }
        catch(err)
        {
            throw new Error(err);
        }
    }
)

const addToWishlist=asyncHandler(async(req,res)=>
{
    const {userId}=req.body;
    validateMongoDBid(userId)
    const findUser=await user.findById(userId);
    const {prodId}=req.body;
    console.log(userId,prodId);
    const alreadyadded=await findUser?.wishList?.find((useid)=>useid.toString()===prodId)
    console.log(alreadyadded);
    if(alreadyadded)
    {
        let findUser= await user.findByIdAndUpdate(userId,
            {
                $pull:{wishList:prodId},
            },
            {
                new:true
            }).populate('wishList')
            
    }
    else
    {
        let findUser= await user.findByIdAndUpdate(userId,
            {
                $push:{wishList:prodId},
            },
            {
                new:true
            }).populate('wishList')
            
    }
    res.json(findUser)
})

const ratings=asyncHandler(async(req,res)=>
{
    const {id}=req.body;
    const {star,prodId}=req.body;
    try
    {
    const findProduct=await product.findById(prodId)
    let alreadyRated= findProduct?.ratings?.find((userId)=>userId.postedby.toString()===id.toString())
    console.log(alreadyRated);
    if(alreadyRated && alreadyRated!=undefined)
    {
        const updateRating=await product.updateOne(
            {
                ratings:{$elemMatch:alreadyRated}
            },
            {
                $set:{"ratings.$.star":star}
            },
            {
                new:true
            }
        )
    }
    else
    {
        const findProduct=await product.findByIdAndUpdate(prodId,
            {
                $push:{
                    ratings:{
                        star:star,
                        postedby:id
                    }
                }
            },
            {
                new:true
            })
    }
    const getallratings=await product.findById(prodId);
    const total=getallratings.ratings.length;
    const sumOfRating=getallratings.ratings.map((item)=>item.star).reduce((prev,curr)=>prev+curr,0)
    const overallRating=Math.round(sumOfRating/total)
    console.log(overallRating);
    const finalProduct=await product.findByIdAndUpdate(prodId,
        {
            totalRating:overallRating
        },
        {
            new:true
        })
    res.json(finalProduct)
    }
    catch(err)
    {
        throw new Error(err)
    }
})


module.exports={createProduct,getallproducts,getaproducts,updateproducts,deleteproducts,addToWishlist,ratings}
