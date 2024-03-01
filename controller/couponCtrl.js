const coupon=require('../models/couponModel')
const asyncHandler=require('express-async-handler')

const createCoupon=asyncHandler(async(req,res)=>
{
    try
    {
        const newCoupon=await coupon.create(req.body);
        res.json(newCoupon)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const deleteCoupon=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
        const newCoupon=await coupon.findByIdAndDelete(id);
        res.json(newCoupon)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const getallCoupon=asyncHandler(async(req,res)=>
{
    try
    {
        const newCoupon=await coupon.find()
        res.json(newCoupon)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const getACoupon=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
        const newCoupon=await coupon.findById(id)
        res.json(newCoupon)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const updateCoupon=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
        const newCoupon=await coupon.findByIdAndUpdate(id,req.body,{new:true})
        res.json(newCoupon)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

module.exports={createCoupon,getallCoupon,getACoupon,updateCoupon,deleteCoupon}