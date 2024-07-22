const prisma = require("../../prisma/prisma");


const getAllBlog = async (req, res) => {
    const blogs = await prisma.blog.findMany();
    return res.json({ blogs }).status(200)
}

// Get a blog
const getBlog = async (req, res) => {
    const blogId = req.params.blogId;
    if (!blogId) {
        return res.json({ error: "Missing blog ID" }).status(400)
    }

    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: blogId
            }
        })
        return res.json({ blog }).status(200)
    } catch (err) {
        console.error(err);
        return res.json({ error: "Error getting blog" }).status(500)
    }
}

// Create a new blog
const createBlog = async (req, res) => {
    const { title, content, userId, description } = req.body;
    if (!title || !content || !userId) {
        return res.json({ error: "Missing required fields" }).status(400)
    }

    try {
        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                userId,
                description
            }
        })
        return res.json({ blog }).status(201)
    } catch (err) {
        console.error(err);
        return res.json({ error: "Error creating blog" }).status(500)
    }
}


// Update a blog
const updateBlog = async (req, res) => {
    const { title, content, userId, description } = req.body;
    const blogId = req.params.blogId;
    if (!title || !content || !userId) {
        return res.json({ error: "Missing required fields" }).status(400)
    }

    try {
        const blog = await prisma.blog.update({
            where: {
                id: blogId
            },
            data: {
                title,
                content,
                userId,
                description
            }
        })
        return res.json(blog).status(200)
    } catch (err) {
        console.error(err);
        return res.json({ error: "Error updating blog" }).status(500)
    }
}

// Delete a blog
const deleteBlog = async (req, res) => {
    const blogId = req.params.blogId;
    if (!blogId) {
        return res.json({ error: "Missing blog ID" }).status(400)
    }

    try {
        await prisma.blog.delete({
            where: {
                id: blogId
            }
        })
        return res.json({ success: "Deleted blog" }).status(200)
    } catch (err) {
        console.error(err);
        return res.json({ error: "Error deleting blog" }).status(500)
    }
}

// get user blogs
const getUserBlogs = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.json({ error: "Missing user ID" }).status(400)
    }

    try {
        const blogs = await prisma.blog.findMany({
            where: {
                userId
            },
            orderBy: {
                updatedAt: 'asc'
            }
        })

        console.log(blogs)
        return res.json({ blogs }).status(200)
    } catch (err) {
        console.error(err);
        return res.json({ error: "Error getting user blogs" }).status(500)
    }
};

// check duplicate seo;
const duplicateSeoPath = async (req, res) => {
    const pathName = req.params.pathName;
    if (!pathName) {
        return res.json(true);
    }
    try {
        const findBlog = await prisma.blog.findFirst({
            where: {
                seoPath: pathName
            }
        });

        // not found duplicate valid path name
        console.log(findBlog)
        if (!findBlog) {
            return res.json(false)
        }

        return res.json(true);
    } catch (err) {
        console.error(err)
        return res.json(true);
    }
}


module.exports = {
    getUserBlogs,
    getBlog,
    getAllBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    duplicateSeoPath
}