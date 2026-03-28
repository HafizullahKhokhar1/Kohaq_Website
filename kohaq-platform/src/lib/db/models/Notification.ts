import { Schema, model, models, type InferSchemaType } from "mongoose";

const notificationSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	type: {
		type: String,
		enum: ["course_enrolled", "certificate_issued", "job_status", "new_reply", "announcement"],
		required: true,
	},
	title: { type: String, required: true },
	message: { type: String, required: true },
	link: { type: String },
	isRead: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export type NotificationDocument = InferSchemaType<typeof notificationSchema> & { _id: string };

const Notification = models.Notification || model("Notification", notificationSchema);

export default Notification;
