const generateToken = require('../config/jwtToken')
const user=require('../models/userModel')
const cart=require('../models/cartModel')
const product=require('../models/productModel')
const asyncHandler= require('express-async-handler')
const validateMongoDBid = require('../utils/validateMongodbid')
const generateRefreshToken = require('../config/refreshToken')
const cookie=require('cookie-parser')
const jwt=require('jsonwebtoken')
const sendEmail = require('./emailCtrl')
const crypto=require('crypto')
const coupon=require('../models/couponModel')
const order=require('../models/orderModel')
const uuid=require('uniqid')

const createUser = asyncHandler(
    async(req,res)=>
{
    const email=req.body.email
    const findUser=await user.findOne({email:email})
    if(!findUser)
    {
        //create new user
        const newuser=await user.create(req.body)
        res.json(newuser)
    }
    else
    {
        //user already exists
        throw new Error("User exists")
    }
}
)

const loginuser=asyncHandler(
    async(req,res)=>
    {   
        console.log(req.body);
        const {email,password}=req.body;
        const finduser=await user.findOne({email})
        if(finduser && await finduser.isPasswordMatched(password))
        {
            const refreshToken=generateRefreshToken(finduser._id)
            // console.log(refreshToken)
            const updateUser=await user.findByIdAndUpdate(finduser._id,
            {
                refreshToken:refreshToken
            },
            {
                new:true
            })
            const cook=res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                maxAge:72*60*60*1000,
            })
            console.log("Login ")
            res.json(
                {
                    _id:finduser._id,
                    firstname:finduser.firstname,
                    lastname:finduser.lastname,
                    mobile:finduser.mobile,
                    token:generateToken(finduser._id)
                }
            )
        }
        else
        {
            throw new Error("Invalid credentials")
        }
    }
)

// Admin Login
const Adminloginuser=asyncHandler(
    async(req,res)=>
    {
        const {email,password}=req.body;
        const finduser=await user.findOne({email})
        if(finduser.role!=='Admin')
        {
            throw new Error("No Authorized")
        }
        if(finduser && await finduser.isPasswordMatched(password))
        {
            const refreshToken=generateRefreshToken(finduser._id)
            // console.log(refreshToken)
            const updateUser=await user.findByIdAndUpdate(finduser._id,
            {
                refreshToken:refreshToken
            },
            {
                new:true
            })
            const cook=res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                maxAge:72*60*60*1000,
            })
            console.log("Login ")
            res.json(
                {
                    _id:finduser._id,
                    firstname:finduser.firstname,
                    lastname:finduser.lastname,
                    mobile:finduser.mobile,
                    token:generateToken(finduser._id)
                }
            )
        }
        else
        {
            throw new Error("Invalid credentials")
        }
    }
   

)
const handleRefreshToken=asyncHandler(async(req,res)=>
{
    const cookie=req.cookies
    // console.log(cookie);
    if(!cookie.refreshToken)
    {
        throw new Error("No refresh Token")
    }
    const refreshToken=cookie.refreshToken
    const foundUser= await user.findOne({refreshToken:refreshToken})
    if(!foundUser)
    {
        throw new Error("No refresh token in dB")
    }
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>
    {
        // console.log(decoded);
        if(err || foundUser.id !== decoded.id)
        {
            throw new Error("SomeThing Went Wrong")
        }
        const accessToken=generateToken(foundUser.id)
        res.json({accessToken})
    })
})

//logout function

const logout=asyncHandler(async(req,res)=>
{
    const cookie=req.cookies 
    if(!cookie.refreshToken)
    {
        throw new Error("No token ")
    }
    const refreshToken=cookie.refreshToken
    const foundUser= await user.findOne({refreshToken:refreshToken})
    if(!foundUser)
    {
        res.clearCookie('refreshToken',
        {
            httpOnly:true,
            secure:true
        })
        return res.sendStatus(204)
    }
    await user.findOneAndUpdate({refreshToken:refreshToken},
        {
            refreshToken:""
        })
    res.clearCookie('refreshToken',
        {
            httpOnly:true,
            secure:true
        })
    res.sendStatus(204)
    console.log("User Logout");
})

const getallusers=asyncHandler(
    async(req,res)=>
    {
        try
        {
            const alluser=await user.find()
            res.json(alluser)
        }
        catch(err)
        {
            throw new Error(err)
        }
    }
)

const getauser=asyncHandler(async(req,res)=>
{
    const { id } =req.params
    validateMongoDBid(id)
    try
    {
        const aUser= await user.findById(id)
        res.json(aUser)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const deleteUser=asyncHandler(async(req,res)=>
{   
    const {id}=req.params
    validateMongoDBid(id)
    try
    {
        const deletedUser= await user.findByIdAndDelete(id)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const updateUser=asyncHandler(async(req,res)=>
{   
    const {id}=req.params
    validateMongoDBid(id)
    try
    {
        const updatedUser= await user.findByIdAndUpdate(id,{
            firstname:"Demo",
            lastname:"F R",
            email:"nithishfrancis14042004@gmail.com",
            mobile:"1234567890",
            password:"gdgdgddg"
        },
        {
            new:true
        })
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const blockUser=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    validateMongoDBid(id)
    try
    {
        const blocked=await user.findByIdAndUpdate(id,{
            isBlocked:true
        },
        {
            new:true
        })
        res.json(blocked)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const unblockUser=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    validateMongoDBid(id)
    try
    {
        const unblocked=await user.findByIdAndUpdate(id,{
            isBlocked:false
        },
        {
            new:true
        })
        res.json(unblocked)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const updatePassword= asyncHandler(async(req,res)=>
{
    const {id}=req.params
    const {password}=req.body
    console.log(id,password);
    const findUser= await user.findById(id)
    if(password)
    {
        findUser.password=password
        const updatedPassword= await findUser.save()
        res.json(updatedPassword)
    }
    else{
        res.json(findUser)
    }
}) 

const forgotPasswordToken = asyncHandler(async(req,res)=>
{
    const {email}=req.body 
    console.log(email)
    const findUser= await user.findOne({email})
    if(!findUser)
    {
        throw new Error("No such User");
    }
    try
    {
        const token= await findUser.createPasswordResetToken()
        console.log(token)
        await findUser.save();
        const resetUrl=`Demo This is me Nithish ,<a href='http:://localhost:4000/api/user/reset-password/${token}'>Click here this is new</>`
        const data={
            to:email,
            text:"Hey User",
            subject:"Forget Password Link",
            htm:resetUrl
        }
        // console.log(data);
        // res.json({token})
        try
        {
            sendEmail(data)
        }
        catch(err)
        {
            throw new Error(err)
        }
    }
    catch(err)
    {
        throw new Error("Nithish")
    }
})

const resetPassword=asyncHandler(async(req,res)=>
{
    const {password}=req.body;
    const {token}=req.params;
    const hashedtoken=crypto.createHash("sha256").update(token).digest("hex")
    const findUser= await user.findOne({
        passwordResetToken:hashedtoken,
        passwordResetExpires:{$gt:Date.now()}
    })
    if(!findUser)
    {
        throw new Error("token Expired")
    }
    findUser.password=password
    findUser.passwordResetToken=undefined;
    findUser.passwordResetExpires=undefined;
    await findUser.save()
    res.json(findUser)
})

const getWishList=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
        const findUser= await user.findById(id).populate("email");
        res.json(findUser)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const saveAddress=asyncHandler(async(req,res)=>
{
    const {id}=req.params
    validateMongoDBid(id)
    try
    {
        const updatedUser= await user.findByIdAndUpdate(id,{
            address:req.body.address
        },
        {
            new:true
        })
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const userCart=asyncHandler(async(req,res)=>
{
    const cartInput=req.body.cart;
    console.log(cartInput);
    const {id}=req.params
    try
    {   
        let products=[]
        const findUser=await user.findById(id)
        const alreadyExistCart=await cart.findOne({orderBy:findUser.id});
        if(alreadyExistCart)
        {
            throw new Error("Product already in the Cart")
        }
        for(let i=0;i<cartInput.length;i++)
        {   
            let object={};
            object.product=cartInput[i].id;
            object.count=cartInput[i].count;
            object.color=cartInput[i].color;
            let getprice=await product.findById(cartInput[i].id).select('price').exec();
            object.price=getprice.price;
            products.push(object)
        }
        console.log(products);
        let cartTotal=0;
        for(let i=0;i<products.length;i++)
        {
            cartTotal+= products[i].price * products[i].count;
            console.log(1)
        }
        let newCart=await new cart({products,cartTotal,orderBy:findUser?.id}).save()
        res.json(newCart)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const getCart=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
        const findCart=await cart.findOne({orderBy:id}).populate("products.product");
        res.json(findCart);
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const deleteCart=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {
        const findUser=await user.findById(id);
        const deletecart=await cart.findOneAndDelete({orderBy:findUser.id});
        res.json(deletecart)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const applyCoupon=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    const {name}=req.body;
    try
    {
        const findCoupon=await coupon.findOne({name:name});
        const findUser=await user.findById(id);
        const {cartTotal}=await cart.findOne({orderBy:findUser.id}).populate("products.product");
        let totalAfterDiscount=(cartTotal - (cartTotal*findCoupon.discount)/100).toFixed(2)
        // console.log(totalAfterDiscount);
        await cart.findOneAndUpdate({orderBy:findUser.id},{totalAfterDiscount},{new:true})
        res.json(totalAfterDiscount)

    }
    catch(err)
    {
        throw new Error(err)
    }
})

const createOrder=asyncHandler(async(req,res)=>
{
    const {COD,couponApplied}=req.body;
    if(!COD)
    {
        throw new Error("Create Cash oredr failed");
    }
    const {id}=req.params;
    try
    {
        const findUser= await user.findById(id);
        console.log(findUser);
        const findCart=await cart.findOne({orderBy:findUser.id});
        let finalAmt=0;
        if(couponApplied && findCart.totalAfterDiscount)
        {
            finalAmt=findCart.totalAfterDiscount + 100;
        }
        else
        {
            finalAmt=findCart.cartTotal +100;
        }

        let newOrder=await new order({
            products:findCart.products,
            paymentIntent:{
                id:uuid(),
                method:"COD",
                amount:finalAmt,
                status:"Cash On Delivery",
                created:Date.now(),
                currency:"Rupee"
            },
            orderBy:findUser.id,
            orderStatus:"COD"
        }).save()
        
        res.json({message:"Success"})
    }
    catch(err)
    {
        throw new Error(err);
    }
})

const getOrders=asyncHandler(async(req,res)=>
{
    const {id}=req.params;
    try
    {   
        const findUser=await user.findById(id)
        const allOrders= await order.findOne({orderBy:findUser.id})
        res.json(allOrders)
    }
    catch(err)
    {
        throw new Error(err)
    }
})

const updateOrderStatus=asyncHandler(async(req,res)=>
{
    const {status}=req.body;
    const {id}=req.params;
    try
    {    
        const findUser=await user.findById(id)
        const allOrders= await order.findOneAndUpdate({orderBy:findUser.id},
            {
                orderStatus:status,
                paymentIntent:{
                    status:status
                }
            },
            {
                new:true
            })  
        res.json(allOrders)
    }
    catch(err)
    {
        throw new Error(err)
    }
})
module.exports= 
{
    createUser,
    loginuser,
    getallusers,
    getauser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    Adminloginuser,
    getWishList,
    saveAddress,
    userCart,
    getCart,
    deleteCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus
}


