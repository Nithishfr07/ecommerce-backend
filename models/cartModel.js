const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products:
    [
    {
        product:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
        },
        count:Number,
        color:String,
        price:Number,
    }
    ],
    cartTotal:Number,
    totalAfterDiscount:Number,
    orderStatus:
    {
        type:String,
        default:"Not Processed",
        enum:["Not Processed","COD","Processing","Despatched","cancelled","Delivered"]
    },
    orderBy:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},
{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('cart', cartSchema);