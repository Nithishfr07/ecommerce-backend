// not found
const notFound=(req,res,next)=>
{
    let error=new Error(req.originalUrl)
    res.status(404)
    next(error)
}

// error Hnadler

const errorHandler=(err,req,res,next)=>
{
    const statuscode= res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode)
    res.json(
        {
            msg:err.message,
            stack: err.stack
            
        }
        // err
    )
}

module.exports={notFound,errorHandler}