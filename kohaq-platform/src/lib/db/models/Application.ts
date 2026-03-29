import { Schema, model, models, type InferSchemaType } from "mongoose";

const applicationSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
	resume: { type: String },
	coverLetter: { type: String },
	status: {
		type: String,
		enum: ["pending", "reviewing", "shortlisted", "rejected", "hired"],
		default: "pending",
	},
	appliedAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

applicationSchema.index({ user: 1, job: 1 }, { unique: true });

applicationSchema.pre("save", function touch(this: InferSchemaType<typeof applicationSchema>) {
	this.updatedAt = new Date();
});

export type ApplicationDocument = InferSchemaType<typeof applicationSchema> & { _id: string };

const Application = models.Application || model("Application", applicationSchema);

export default Application;
