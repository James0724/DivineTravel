import mongoose, { Schema, Document, Types } from "mongoose";
// Import User so the "User" ref is always registered before populate runs
import "./User";

export type PostCategory =
  | "migration"
  | "destinations"
  | "planning"
  | "wildlife"
  | "culture"
  | "conservation"
  | "photography"
  | "tips";

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: Types.ObjectId;
  category: PostCategory;
  tags: string[];
  faqs: { question: string; answer: string }[];
  featured: boolean;
  published: boolean;
  publishedAt?: Date;
  readingTime: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: { type: String, required: true, maxlength: 300 },
    body: { type: String, required: true },
    coverImage: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "migration",
        "destinations",
        "planning",
        "wildlife",
        "culture",
        "conservation",
        "photography",
        "tips",
      ],
      required: true,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    faqs: [{ question: { type: String, required: true }, answer: { type: String, required: true } }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    readingTime: { type: Number, default: 5 },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

PostSchema.index({ published: 1, publishedAt: -1 });
PostSchema.index({ featured: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({
  title: "text",
  excerpt: "text",
  body: "text",
  tags: "text",
});

// Always delete the cached model so the current schema (with author as ObjectId ref)
// is used — otherwise Mongoose keeps the old String-author schema across hot reloads
// and populate silently returns the raw ObjectId hex instead of the User document.
delete (mongoose.models as Record<string, unknown>).Post;
const PostModel = mongoose.model<IPost>("Post", PostSchema);

export default PostModel;
