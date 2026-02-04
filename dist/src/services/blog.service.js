import prisma from '../config/database.js';
export class BlogService {
    // Get all blogs
    static async getAllBlogs(page = 1, limit = 10, search, category) {
        const skip = (page - 1) * limit;
        const whereClause = {
            isPublished: true
        };
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category) {
            whereClause.category = category;
        }
        const [blogs, total] = await Promise.all([
            prisma.blog.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    featuredImage: true,
                    author: true,
                    category: true,
                    views: true,
                    createdAt: true
                }
            }),
            prisma.blog.count({ where: whereClause })
        ]);
        return {
            blogs,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    }
    // Get single blog
    static async getBlogById(id) {
        const blog = await prisma.blog.findUnique({
            where: { id }
        });
        if (!blog) {
            throw new Error('Blog not found');
        }
        // Increment views
        await prisma.blog.update({
            where: { id },
            data: { views: { increment: 1 } }
        });
        return blog;
    }
    // Get blog by slug
    static async getBlogBySlug(slug) {
        const blog = await prisma.blog.findUnique({
            where: { slug }
        });
        if (!blog) {
            throw new Error('Blog not found');
        }
        await prisma.blog.update({
            where: { slug },
            data: { views: { increment: 1 } }
        });
        return blog;
    }
    // Create blog
    static async createBlog(blogData, adminId) {
        const slug = blogData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const blog = await prisma.blog.create({
            data: {
                ...blogData,
                slug,
                author: 'Admin'
            }
        });
        // Log the action
        await prisma.log.create({
            data: {
                action: 'blog_created',
                details: { blogId: blog.id, title: blog.title },
                userType: 'admin',
                endpoint: 'POST /blogs'
            }
        });
        return blog;
    }
    // Update blog
    static async updateBlog(id, updateData) {
        const blog = await prisma.blog.findUnique({
            where: { id }
        });
        if (!blog) {
            throw new Error('Blog not found');
        }
        const updatePayload = { ...updateData };
        if (updateData.title) {
            const slug = updateData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            updatePayload.slug = slug;
        }
        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: updatePayload
        });
        await prisma.log.create({
            data: {
                action: 'blog_updated',
                details: { blogId: id, title: updatedBlog.title },
                userType: 'admin',
                endpoint: 'PUT /blogs/:id'
            }
        });
        return updatedBlog;
    }
    // Delete blog
    static async deleteBlog(id) {
        const blog = await prisma.blog.findUnique({
            where: { id }
        });
        if (!blog) {
            throw new Error('Blog not found');
        }
        await prisma.blog.delete({
            where: { id }
        });
        await prisma.log.create({
            data: {
                action: 'blog_deleted',
                details: { blogId: id, title: blog.title },
                userType: 'admin',
                endpoint: 'DELETE /blogs/:id'
            }
        });
        return { message: 'Blog deleted successfully' };
    }
    // Get blog categories
    // Get blog categories
    // Get blog categories
    static async getBlogCategories() {
        try {
            const blogs = await prisma.blog.findMany({
                where: {
                    isPublished: true
                    // Remove the entire category filter!
                },
                select: {
                    category: true
                }
            });
            // Get unique categories using Set
            const uniqueCategories = [...new Set(blogs.map(blog => blog.category))];
            return uniqueCategories;
        }
        catch (error) {
            console.error('❌ Error fetching categories:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=blog.service.js.map