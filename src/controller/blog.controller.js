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
    try {
        const { seoPath } = req.body;
        const blog = await prisma.blog.create({
            data: {
                ...req.body,
                seoPath: seoPath.replace(/\s/g, '-').toLowerCase(),
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
    const blogId = req.params.blogId;
    try {
        const blog = await prisma.blog.update({
            where: {
                id: blogId
            },
            data: {
                ...req.body,
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

// get blog by blog path
const getBlogPath = async (req, res) => {
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

        console.log(findBlog)
        if (!findBlog) {
            return res.json(null)
        }

        return res.json(findBlog);
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
    getBlogPath
}