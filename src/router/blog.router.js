const { Router } = require("express");
const { blogSchema } = require("../validator");
const { getAllBlog, getBlog, createBlog, updateBlog, deleteBlog, getUserBlogs, getBlogPath } = require("../controller/blog.controller");
const validator = require('express-joi-validation').createValidator({});

const BlogRouter = Router();
// get all blogs
BlogRouter.get("/", getAllBlog)
// get a blog
BlogRouter.get("/:blogId", getBlog)
// create a new blog
BlogRouter.post("/", validator.body(blogSchema), createBlog)
// update a blog
BlogRouter.put("/:blogId", validator.body(blogSchema), updateBlog)
// delete a blog
BlogRouter.delete("/:blogId", deleteBlog)
// get user's blogs
BlogRouter.get("/user/:userId", getUserBlogs)
// seo path checker
BlogRouter.get("/path/:pathName", getBlogPath)

module.exports = BlogRouter