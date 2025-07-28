import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

export interface IRemark extends Document {
  project: mongoose.Types.ObjectId | IProject;
  user: mongoose.Types.ObjectId | IUser;
  content: string;
  type: 'Note' | 'Comment' | 'Warning' | 'Suggestion' | 'Documentation';
  isPrivate: boolean;
  visibleTo?: (mongoose.Types.ObjectId | IUser)[];
  tags?: string[];
  attachments?: string[];
  parentRemark?: mongoose.Types.ObjectId | IRemark;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
}

const RemarkSchema = new Schema<IRemark>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Note', 'Comment', 'Warning', 'Suggestion', 'Documentation'],
      default: 'Comment',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    visibleTo: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    attachments: [{
      type: String,
    }],
    parentRemark: {
      type: Schema.Types.ObjectId,
      ref: 'Remark',
    },
    editedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
RemarkSchema.index({ project: 1 });
RemarkSchema.index({ user: 1 });
RemarkSchema.index({ type: 1 });
RemarkSchema.index({ isPrivate: 1 });
RemarkSchema.index({ parentRemark: 1 });

// Pre-save middleware to update editedAt when content is modified
RemarkSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.editedAt = new Date();
  }
  next();
});

// Delete the Remark model if it exists to prevent OverwriteModelError
const Remark: Model<IRemark> = mongoose.models.Remark || mongoose.model<IRemark>('Remark', RemarkSchema);

export default Remark; 