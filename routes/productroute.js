const express=require('express')
const { createProduct, getallproducts, getaproducts, updateproducts, deleteproducts, addToWishlist, ratings } = require('../controller/productCtrl')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages')
const router=express.Router()


router.post('/createProduct',createProduct)
router.put('/wishlist',addToWishlist)
router.get('/allProducts',getallproducts)
router.get('/allProducts/:id',getaproducts)
router.put('/update/:id',updateproducts)
router.delete('/delete/:id',deleteproducts)
router.put('/rate',ratings)



module.exports=router