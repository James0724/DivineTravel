import mongoose, { Schema, Document } from "mongoose";

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
  author: string;
  authorAvatar?: string;
  authorTitle?: string;
  authorBio?: string;
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
      type: String,
      required: true,
      default: "Divine Travel Nest Safaris",
    },
    authorAvatar: { type: String },
    authorTitle: { type: String },
    authorBio: { type: String },
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

const PostModel: mongoose.Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default PostModel;
