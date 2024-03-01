const express=require('express')
const { createBlog, updateBlog, getAllBlogs, getAblog, deleteBlog, likeBlog, disLikeBlog } = require('../controller/blogctrl')
const router=express.Router()

router.get('/allblogs',getAllBlogs)
router.put('/dislikeblog/',disLikeBlog)
router.put('/likeblog/',likeBlog)
router.post('/create',createBlog)
router.put('/update/:id',updateBlog)
router.get('/allblogs/:id',getAblog)
router.delete('/delete/:id',deleteBlog)



module.exports=router