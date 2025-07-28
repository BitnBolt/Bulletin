import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IProject extends Document {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId | IUser;
  members: (mongoose.Types.ObjectId | IUser)[];
  deadline: Date;
  status: 'Not Started' | 'Planning' | 'In Progress' | 'At Risk' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  tags: string[];
  category: string;
  completion: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner is required'],
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    deadline: {
      type: Date,
      required: [true, 'Project deadline is required'],
    },
    status: {
      type: String,
      enum: ['Not Started', 'Planning', 'In Progress', 'At Risk', 'Completed'],
      default: 'Not Started',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    category: {
      type: String,
      default: 'IoT',
      trim: true,
    },
    completion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ members: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ deadline: 1 });

// Delete the Project model if it exists to prevent OverwriteModelError
const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project; 