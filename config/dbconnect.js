const mongoose=require('mongoose')

const dbconnect=()=>
{   
    try
    {
    const conn=mongoose.connect(process.env.MONGODB_URL)
    console.log("Database Connected")
    }
    catch(err)
    {
        console.log("Database Error")
    }

}

module.exports = dbconnect;