import { Schema, model, models, type InferSchemaType } from "mongoose";

const lessonSchema = new Schema(
	{
		course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
		title: { type: String, required: true, trim: true },
		description: { type: String },
		youtubeVideoId: { type: String, required: true, trim: true },
		duration: { type: Number, default: 0 },
		order: { type: Number, default: 0 },
		resources: [
			{
				name: { type: String },
				url: { type: String },
				type: { type: String, enum: ["pdf", "link", "code"] },
			},
		],
		hasQuiz: { type: Boolean, default: false },
		quiz: [
			{
				question: { type: String },
				options: [{ type: String }],
				correctIndex: { type: Number },
			},
		],
		isPublished: { type: Boolean, default: false },
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

lessonSchema.index({ course: 1, order: 1 });

export type LessonDocument = InferSchemaType<typeof lessonSchema> & { _id: string };

const Lesson = models.Lesson || model("Lesson", lessonSchema);

export default Lesson;
