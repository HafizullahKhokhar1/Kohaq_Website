import { Schema, model, models, type InferSchemaType } from "mongoose";

const enrollmentSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
	enrolledAt: { type: Date, default: Date.now },
	completedAt: { type: Date },
	overallProgress: { type: Number, default: 0, min: 0, max: 100 },
	certificateIssued: { type: Boolean, default: false },
	certificateId: { type: String },
});

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export type EnrollmentDocument = InferSchemaType<typeof enrollmentSchema> & { _id: string };

const Enrollment = models.Enrollment || model("Enrollment", enrollmentSchema);

export default Enrollment;
