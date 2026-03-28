import { Schema, model, models, type InferSchemaType } from "mongoose";

const jobSchema = new Schema({
	title: { type: String, required: true, trim: true },
	company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
	description: { type: String },
	requirements: [{ type: String }],
	type: {
		type: String,
		enum: ["full-time", "part-time", "contract", "internship", "remote"],
	},
	domain: { type: String },
	location: { type: String },
	salary: {
		min: { type: Number },
		max: { type: Number },
		currency: { type: String, default: "PKR" },
	},
	applicationDeadline: { type: Date },
	applicationLink: { type: String },
	isKohaqInternal: { type: Boolean, default: false },
	isActive: { type: Boolean, default: true },
	postedBy: { type: Schema.Types.ObjectId, ref: "User" },
	applicationCount: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
});

jobSchema.index({ isActive: 1, domain: 1, type: 1 });

export type JobDocument = InferSchemaType<typeof jobSchema> & { _id: string };

const Job = models.Job || model("Job", jobSchema);

export default Job;
