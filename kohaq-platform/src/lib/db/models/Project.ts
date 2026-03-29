import { Schema, model, models, type InferSchemaType } from "mongoose";

const projectSchema = new Schema({
	title: { type: String, required: true, trim: true },
	description: { type: String },
	thumbnail: { type: String },
	demoUrl: { type: String },
	githubUrl: { type: String },
	youtubeVideoId: { type: String },
	tags: [{ type: String }],
	contributors: [
		{
			user: { type: Schema.Types.ObjectId, ref: "User" },
			role: { type: String },
		},
	],
	resources: [
		{
			name: { type: String },
			url: { type: String },
		},
	],
	isFeatured: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

projectSchema.index({ isFeatured: 1, createdAt: -1 });

export type ProjectDocument = InferSchemaType<typeof projectSchema> & { _id: string };

const Project = models.Project || model("Project", projectSchema);

export default Project;
