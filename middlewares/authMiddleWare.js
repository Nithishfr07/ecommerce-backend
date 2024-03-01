const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
const user=require('../models/userModel')

const authMiddleWare= asyncHandler(
    async(req,res,next)=>
    {
        let token;
        if("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjBiNzYzYmMwOGQ5MzYwMDgwMzhhMyIsImlhdCI6MTcwMDg0MTUzMSwiZXhwIjoxNzAxMTAwNzMxfQ.-eOvIfyb-YkeiOrW2q44XuV3tkH8ZgkOr4QmIc_kvQ0")
        {
            token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjBiNzYzYmMwOGQ5MzYwMDgwMzhhMyIsImlhdCI6MTcwMDg0MTUzMSwiZXhwIjoxNzAxMTAwNzMxfQ.-eOvIfyb-YkeiOrW2q44XuV3tkH8ZgkOr4QmIc_kvQ0"
            try
            {
                if(token)
                {
                    const decoded=jwt.verify(token,process.env.JWT_SECRET)
                    // console.log(decoded);
                    const User=user.findById(decoded._id)
                    req.user=User
                    // console.log(req.user)
                    next()
                }
            }
            catch(err)
            {
                throw new Error("No authorization, Token Expired, Lohin again")
            }
        }
        else
        {
            throw new Error('No token attached to the header')
        }
    }
)

const isAdmin=asyncHandler(
    async(req,res,next)=>
    {
        const {email}=req.user;
        const admin=await user.findOne(email)
        if(admin.role==='admin')
        {
            next()
        }
        else
        {
            throw new Error("You are not an Admin")
        }
    }
)
module.exports={authMiddleWare};