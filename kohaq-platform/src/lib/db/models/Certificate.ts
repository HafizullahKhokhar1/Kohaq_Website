import { Schema, model, models, type InferSchemaType } from "mongoose";

const certificateSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
	enrollment: { type: Schema.Types.ObjectId, ref: "Enrollment", required: true },
	certificateId: { type: String, required: true, unique: true },
	issuedAt: { type: Date, default: Date.now },
	verificationUrl: { type: String },
});

certificateSchema.index({ certificateId: 1 }, { unique: true });

export type CertificateDocument = InferSchemaType<typeof certificateSchema> & { _id: string };

const Certificate = models.Certificate || model("Certificate", certificateSchema);

export default Certificate;
