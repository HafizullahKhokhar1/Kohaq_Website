import { Schema, model, models, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String },
		image: { type: String },
		role: {
			type: String,
			enum: ["student", "intern", "instructor", "partner", "admin"],
			default: "student",
		},
		bio: { type: String },
		linkedin: { type: String },
		github: { type: String },
		isVerified: { type: Boolean, default: false },
		enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
		savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
		company: { type: Schema.Types.ObjectId, ref: "Company" },
	},
	{
		timestamps: true,
	}
);

userSchema.index({ email: 1 }, { unique: true });

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: string };

const User = models.User || model("User", userSchema);

export default User;
