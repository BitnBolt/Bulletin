import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

export interface IIssue extends Document {
  title: string;
  description: string;
  project: mongoose.Types.ObjectId | IProject;
  creator: mongoose.Types.ObjectId | IUser;
  assignee: mongoose.Types.ObjectId | IUser;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Reopened';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Bug' | 'Feature' | 'Hardware' | 'Connectivity' | 'Sensor' | 'Power' | 'Other';
  dueDate?: Date;
  isCritical: boolean;
  sensorData?: {
    sensorType?: string;
    readingValue?: number;
    readingUnit?: string;
    expectedRange?: {
      min?: number;
      max?: number;
    };
  };
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const IssueSchema = new Schema<IIssue>(
  {
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Issue creator is required'],
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed', 'Reopened'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    type: {
      type: String,
      enum: ['Bug', 'Feature', 'Hardware', 'Connectivity', 'Sensor', 'Power', 'Other'],
      default: 'Other',
    },
    dueDate: {
      type: Date,
    },
    isCritical: {
      type: Boolean,
      default: false,
    },
    sensorData: {
      sensorType: {
        type: String,
      },
      readingValue: {
        type: Number,
      },
      readingUnit: {
        type: String,
      },
      expectedRange: {
        min: {
          type: Number,
        },
        max: {
          type: Number,
        },
      },
    },
    attachments: [{
      type: String,
    }],
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
IssueSchema.index({ project: 1 });
IssueSchema.index({ creator: 1 });
IssueSchema.index({ assignee: 1 });
IssueSchema.index({ status: 1 });
IssueSchema.index({ isCritical: 1 });

// Pre-save middleware to set isCritical based on priority
IssueSchema.pre('save', function(next) {
  if (this.priority === 'Critical') {
    this.isCritical = true;
  }
  next();
});

// Delete the Issue model if it exists to prevent OverwriteModelError
const Issue: Model<IIssue> = mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);

export default Issue; 