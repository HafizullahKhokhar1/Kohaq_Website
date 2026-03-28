import { Schema, model, models, type InferSchemaType } from "mongoose";

const companySchema = new Schema({
	name: { type: String, required: true, trim: true },
	logo: { type: String },
	website: { type: String },
	description: { type: String },
	industry: { type: String },
	size: { type: String },
	location: { type: String },
	isVerified: { type: Boolean, default: false },
	contactEmail: { type: String },
	createdAt: { type: Date, default: Date.now },
});

companySchema.index({ name: 1 });

export type CompanyDocument = InferSchemaType<typeof companySchema> & { _id: string };

const Company = models.Company || model("Company", companySchema);

export default Company;
