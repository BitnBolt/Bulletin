import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

export interface IActivity extends Document {
  title: string;
  description: string;
  project: mongoose.Types.ObjectId | IProject;
  user: mongoose.Types.ObjectId | IUser;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  type: 'Setup' | 'Maintenance' | 'Monitoring' | 'Testing' | 'Deployment' | 'Other';
  startDate: Date;
  endDate?: Date;
  deadline?: Date;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    interval: number;
    endAfterOccurrences?: number;
    endDate?: Date;
  };
  iotData?: {
    deviceId?: string;
    sensorType?: string;
    location?: string;
    parameters?: Record<string, any>;
  };
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Activity description is required'],
      trim: true,
    },
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
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    type: {
      type: String,
      enum: ['Setup', 'Maintenance', 'Monitoring', 'Testing', 'Deployment', 'Other'],
      default: 'Other',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
      },
      interval: {
        type: Number,
        default: 1,
      },
      endAfterOccurrences: {
        type: Number,
      },
      endDate: {
        type: Date,
      },
    },
    iotData: {
      deviceId: {
        type: String,
      },
      sensorType: {
        type: String,
      },
      location: {
        type: String,
      },
      parameters: {
        type: Schema.Types.Mixed,
      },
    },
    attachments: [{
      type: String,
    }],
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
ActivitySchema.index({ project: 1 });
ActivitySchema.index({ user: 1 });
ActivitySchema.index({ status: 1 });
ActivitySchema.index({ startDate: 1 });
ActivitySchema.index({ deadline: 1 });

// Pre-save middleware to update completedAt when status changes to Completed
ActivitySchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Delete the Activity model if it exists to prevent OverwriteModelError
const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity; 