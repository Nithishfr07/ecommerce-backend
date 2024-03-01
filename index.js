const express=require('express');
const app=express();
const dotenv=require('dotenv').config()
const PORT=process.env.PORT || 4000;
const dbconnect=require('./config/dbconnect')
const authRouter=require('./routes/authroutes');
const productRouter=require('./routes/productroute')
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const path=require('path');
const cookieParser = require('cookie-parser');
const morgan=require('morgan')
const blogRouter=require('./routes/blogroutes')
const productCategoryRouter=require('./routes/productCategoryroutes')
const blogCategoryRouter=require('./routes/blogCategoryroutes')
const brandRouter=require('./routes/brandroute')
const couponRouter=require('./routes/couponroutes')

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

// app.get('/',(req,res)=>
// {
//     res.sendFile(path.join(__dirname,'views','index.html'))
// })
app.get('/',(req,res)=>
{
    res.send("Hi")
})
app.use('/api/user',authRouter)
app.use('/api/product',productRouter)
app.use('/api/blog',blogRouter)
app.use('/api/productcategory',productCategoryRouter)
app.use('/api/blogcategory',blogCategoryRouter)
app.use('/api/brand',brandRouter)
app.use('/api/coupon',couponRouter)


// app.use(notFound)
app.use(errorHandler)
app.listen(PORT,()=>
{   dbconnect();
    console.log("Server is running successfully")
})






//code grepper