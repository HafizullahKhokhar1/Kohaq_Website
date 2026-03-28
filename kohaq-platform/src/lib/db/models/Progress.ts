import { Schema, model, models, type InferSchemaType } from "mongoose";

const progressSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
	lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
	watchedSeconds: { type: Number, default: 0, min: 0 },
	totalSeconds: { type: Number, required: true, min: 1 },
	watchPercentage: { type: Number, default: 0, min: 0, max: 100 },
	isCompleted: { type: Boolean, default: false },
	completedAt: { type: Date },
	lastWatchedAt: { type: Date },
});

progressSchema.index({ user: 1, lesson: 1 }, { unique: true });

progressSchema.pre("save", function updateProgress(this: InferSchemaType<typeof progressSchema>) {
	if (this.totalSeconds > 0) {
		this.watchPercentage = Math.min(100, (this.watchedSeconds / this.totalSeconds) * 100);
	}

	if (this.watchPercentage >= 90 && !this.isCompleted) {
		this.isCompleted = true;
		this.completedAt = new Date();
	}
});

export type ProgressDocument = InferSchemaType<typeof progressSchema> & { _id: string };

const Progress = models.Progress || model("Progress", progressSchema);

export default Progress;
