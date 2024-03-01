const express=require('express')
const { createCoupon, getallCoupon, getACoupon, deleteCoupon, updateCoupon } = require('../controller/couponCtrl')
const router=express.Router()

router.post('/create',createCoupon)
router.get('/allcoupon',getallCoupon)
router.get('/allcoupon/:id',getACoupon)
router.delete('/delete/:id',deleteCoupon)
router.put('/update/:id',updateCoupon)

module.exports=router