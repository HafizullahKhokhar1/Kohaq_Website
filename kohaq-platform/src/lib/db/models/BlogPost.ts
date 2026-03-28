import { Schema, model, models, type InferSchemaType } from "mongoose";

const blogPostSchema = new Schema({
	title: { type: String, required: true, trim: true },
	slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
	content: { type: String },
	excerpt: { type: String },
	thumbnail: { type: String },
	author: { type: Schema.Types.ObjectId, ref: "User" },
	tags: [{ type: String }],
	category: { type: String },
	isPublished: { type: Boolean, default: false },
	publishedAt: { type: Date },
	metaTitle: { type: String },
	metaDescription: { type: String },
	readTime: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
});

blogPostSchema.index({ slug: 1 }, { unique: true });

export type BlogPostDocument = InferSchemaType<typeof blogPostSchema> & { _id: string };

const BlogPost = models.BlogPost || model("BlogPost", blogPostSchema);

export default BlogPost;
