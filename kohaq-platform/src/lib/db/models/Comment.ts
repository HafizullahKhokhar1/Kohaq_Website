import { Schema, model, models, type InferSchemaType } from "mongoose";

const commentSchema = new Schema({
	thread: { type: Schema.Types.ObjectId, ref: "Thread", required: true },
	author: { type: Schema.Types.ObjectId, ref: "User" },
	content: { type: String, required: true },
	parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
	upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	createdAt: { type: Date, default: Date.now },
});

commentSchema.index({ thread: 1, createdAt: 1 });

export type CommentDocument = InferSchemaType<typeof commentSchema> & { _id: string };

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;
