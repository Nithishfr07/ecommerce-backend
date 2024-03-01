const express= require('express');
const { createProductCategory, getAllCategory, getAcategory, deleteCategory, updateCategory } = require('../controller/productCategoryCtrl');
const router=express.Router();

router.post('/createcategory',createProductCategory)
router.get('/allcategory',getAllCategory)
router.get('/allcategory/:id',getAcategory)
router.delete('/deletecategory/:id',deleteCategory)
router.put('/updatecategory/:id',updateCategory)

module.exports=router