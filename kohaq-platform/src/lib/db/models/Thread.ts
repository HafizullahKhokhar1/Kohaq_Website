import { Schema, model, models, type InferSchemaType } from "mongoose";

const threadSchema = new Schema({
	title: { type: String, required: true, trim: true },
	content: { type: String },
	author: { type: Schema.Types.ObjectId, ref: "User" },
	category: { type: String },
	tags: [{ type: String }],
	course: { type: Schema.Types.ObjectId, ref: "Course" },
	upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	commentCount: { type: Number, default: 0 },
	isPinned: { type: Boolean, default: false },
	isResolved: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

threadSchema.index({ category: 1, createdAt: -1 });

export type ThreadDocument = InferSchemaType<typeof threadSchema> & { _id: string };

const Thread = models.Thread || model("Thread", threadSchema);

export default Thread;
