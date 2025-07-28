export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Activity {
  id: string;
  description: string;
  date: string;
  user: string;
  type: 'update' | 'comment' | 'status_change' | 'member_added' | 'file_upload';
  visibility?: 'all' | 'team' | 'owner' | string[]; // Visibility control: all, team, owner, or specific members
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  createdAt: string;
  dueDate?: string;
}

export interface DailyCheck {
  id: string;
  date: string;
  status: 'completed' | 'pending' | 'missed';
  notes?: string;
  completedBy?: string;
}

export interface Remark {
  id: string;
  content: string;
  author: string;
  date: string;
  type: 'general' | 'warning' | 'important';
  visibility?: 'all' | 'team' | 'owner' | string[]; // Visibility control
}

export interface MemberHours {
  memberId: string;
  name: string;
  hours: number[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Not Started' | 'Planning' | 'In Progress' | 'At Risk' | 'Completed';
  startDate: string;
  deadline: string;
  completion: number;
  owner: string;
  members: ProjectMember[];
  activities: Activity[];
  issues: Issue[];
  dailyChecks: DailyCheck[];
  remarks: Remark[];
  weeklyThroughput: number[];
  memberHours?: MemberHours[]; // Weekly work hours for each member
  lastUpdated: string;
} 