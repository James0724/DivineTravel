import mongoose, { Schema, Document, Types } from "mongoose";

export type CommentStatus = "pending" | "approved" | "rejected" | "spam";

export interface IComment extends Document {
  postId: Types.ObjectId;
  postSlug: string;
  parentId: Types.ObjectId | null;
  name: string;
  email: string;
  body: string;
  status: CommentStatus;
  ipAddress?: string;
  userAgent?: string;
  subscribeToReplies: boolean;
  avatarUrl: string;
  adminReply: { body: string; repliedAt: Date } | null;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    postSlug: { type: String, required: true, trim: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "spam"],
      default: "pending",
      index: true,
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    subscribeToReplies: { type: Boolean, default: false },
    avatarUrl: { type: String, default: "" },
    adminReply: {
      type: {
        body: { type: String, required: true },
        repliedAt: { type: Date, required: true },
      },
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CommentSchema.index({ postSlug: 1, status: 1, createdAt: 1 });
CommentSchema.index({ status: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });

const CommentModel: mongoose.Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default CommentModel;
