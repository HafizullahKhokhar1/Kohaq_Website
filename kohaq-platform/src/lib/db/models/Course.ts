import { Schema, model, models, type InferSchemaType } from "mongoose";

const courseSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
		description: { type: String },
		shortDesc: { type: String, maxlength: 160 },
		thumbnail: { type: String },
		instructor: { type: Schema.Types.ObjectId, ref: "User" },
		category: { type: String },
		tags: [{ type: String }],
		level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
		price: { type: Number, default: 0 },
		isPublished: { type: Boolean, default: false },
		lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
		totalDuration: { type: Number, default: 0 },
		enrollmentCount: { type: Number, default: 0 },
		rating: {
			average: { type: Number, default: 0 },
			count: { type: Number, default: 0 },
		},
		requirements: [{ type: String }],
		outcomes: [{ type: String }],
		metaTitle: { type: String },
		metaDescription: { type: String },
	},
	{ timestamps: true }
);

courseSchema.index({ slug: 1 }, { unique: true });

export type CourseDocument = InferSchemaType<typeof courseSchema> & { _id: string };

const Course = models.Course || model("Course", courseSchema);

export default Course;
