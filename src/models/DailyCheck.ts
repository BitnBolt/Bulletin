import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

export interface IDailyCheck extends Document {
  project: mongoose.Types.ObjectId | IProject;
  user: mongoose.Types.ObjectId | IUser;
  date: Date;
  status: 'Pending' | 'Completed' | 'Skipped' | 'Issue Detected';
  checkItems: {
    name: string;
    status: 'Pass' | 'Fail' | 'Warning' | 'Not Applicable';
    value?: number;
    unit?: string;
    expectedRange?: {
      min?: number;
      max?: number;
    };
    notes?: string;
  }[];
  sensorReadings: {
    sensorId: string;
    sensorName: string;
    sensorType: string;
    value: number;
    unit: string;
    timestamp: Date;
    status: 'Normal' | 'Warning' | 'Critical';
  }[];
  systemHealth: {
    overall: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
    connectivity: 'Online' | 'Intermittent' | 'Offline';
    batteryLevel?: number;
    powerStatus?: 'AC' | 'Battery' | 'Solar' | 'Other';
  };
  observations: string;
  actionItems?: string[];
  attachments?: string[];
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DailyCheckSchema = new Schema<IDailyCheck>(
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
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Skipped', 'Issue Detected'],
      default: 'Pending',
    },
    checkItems: [{
      name: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['Pass', 'Fail', 'Warning', 'Not Applicable'],
        required: true,
      },
      value: {
        type: Number,
      },
      unit: {
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
      notes: {
        type: String,
      },
    }],
    sensorReadings: [{
      sensorId: {
        type: String,
        required: true,
      },
      sensorName: {
        type: String,
        required: true,
      },
      sensorType: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['Normal', 'Warning', 'Critical'],
        default: 'Normal',
      },
    }],
    systemHealth: {
      overall: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'],
        required: true,
      },
      connectivity: {
        type: String,
        enum: ['Online', 'Intermittent', 'Offline'],
        required: true,
      },
      batteryLevel: {
        type: Number,
        min: 0,
        max: 100,
      },
      powerStatus: {
        type: String,
        enum: ['AC', 'Battery', 'Solar', 'Other'],
      },
    },
    observations: {
      type: String,
      required: [true, 'Observations are required'],
    },
    actionItems: [{
      type: String,
    }],
    attachments: [{
      type: String,
    }],
    isShared: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
DailyCheckSchema.index({ project: 1 });
DailyCheckSchema.index({ user: 1 });
DailyCheckSchema.index({ date: 1 });
DailyCheckSchema.index({ status: 1 });
DailyCheckSchema.index({ 'systemHealth.overall': 1 });

// Pre-save middleware to update status based on check items
DailyCheckSchema.pre('save', function(next) {
  if (this.checkItems && this.checkItems.length > 0) {
    const hasFailure = this.checkItems.some(item => item.status === 'Fail');
    if (hasFailure) {
      this.status = 'Issue Detected';
    } else if (this.status === 'Pending' && this.checkItems.every(item => item.status)) {
      this.status = 'Completed';
    }
  }
  next();
});

// Delete the DailyCheck model if it exists to prevent OverwriteModelError
const DailyCheck: Model<IDailyCheck> = mongoose.models.DailyCheck || mongoose.model<IDailyCheck>('DailyCheck', DailyCheckSchema);

export default DailyCheck; 