import { StaticImageData } from "next/image";
type TSection = {
  section: string;
  headline: string;
};

export type TProfile = {
  name: string;
  email: string;
  phone: string;
  image: StaticImageData;
  role: string;
  password: string;
  date: string;
};

export interface TTeamMember {
  user: TUser;
  role: TRole;
  addedAt: Date;
  addedBy: TUser | string; 
  _id?: string;
}

export interface TransformedTeamMember {
  username: string;
  email: string;
  phone: string;
  role: TRole;
  _id: string;
  teamMemberId: string;
  created_at?: string;
  addedAt: string; 
  addedBy: string; 
}


export type TUpdates = {
  user_to_project: TSection;
  user_from_project: TSection;
  user_to_organization: TSection;
  user_from_organization: TSection;
  user_to_team: TSection;
  user_from_team: TSection;
  user_to_task: TSection;
  user_from_task: TSection;
  user_to_file: TSection;
  user_from_file: TSection;
  user_to_chat: TSection;
  user_from_chat: TSection;
  user_to_message: TSection;
  user_from_message: TSection;
  project_to_organization: TSection;
  project_from_organization: TSection;
  add_to_team: TSection;
  remove_from_team: TSection;
  add_to_task: TSection;
  remove_from_task: TSection;
  add_to_file: TSection;
  remove_from_file: TSection;
  add_to_chat: TSection;
  remove_from_chat: TSection;
}

export type TLanguage = {
  country: {
    image: StaticImageData;
    language: string;
    code: string;
  };
};

export type TChatGroup = {
  _id?: string;
  name: string;
  description?: string;
  isGroupChat?: boolean;
  avatar?: string;
  organization?: string;
  participants?: TUser[];
  lastMessage?: string;
  invitationLink?: string;
  lastMessageSender?: string;
  invitationLinkExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  isPublic?: boolean;
  createdBy?: TUser;
}

export type TUser = {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  role?: string;
  organization?: string;
  isPremium?: boolean;
  profileImage?: string;
  services?: TService[];
  chatGroups?: TChatGroup[];
  file?: TFile[];
  projects?: TProject[];
  tasks?: TTask[];
  created_at?: string;
  status?: "active" | "inactive" | "banned" | "pending";
};

export type TRole =
  | "Admin"
  | "Super Admin"
  | "Project Manager"
  | "Developer"
  | "Team Member"
  | "User";

export type TService = {
  _id?: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  price: number;
  duration: number;
  type: string;
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
};

export type TOrganization = {
  _id?: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  superAdmin?: TUser;
  users?: TUser[];
  projects?: TProject[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TFile = {
  _id: string;
  name: string;
};
export type TProject = {
  _id?: string;
  name: string;
  description?: string;
  status?: "active" | "inactive" | "completed" | "archived";
  createdBy: TUser;
  organization: TOrganization;
  teamMembers?: TTeamMember[];
  files?: TFile[];
  tasks?: TTask[];
  createdAt?: Date;
  updatedAt?: Date;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  labels?: string[];
  isPublic?: boolean;
  allowExternalContributors?: boolean;
};
export type TTask = {
  _id?: string;
  name: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed" | "blocked";
  priority?: "low" | "medium" | "high";

  createdBy: TUser;
  assignedTo: TUser[];
  project: TProject;
  organization: TOrganization;

  tags?: string[];
  estimatedTime?: number; // in hours (Estimated time to complete the task)
  actualTime?: number; // in hours (Actual time spent on the task)

  comments?: string[];
  attachments?: string[];
  history?: string[];

  createdAt?: Date;
  updatedAt?: Date;

  percentage?: string;
};

export type TSections = {
  dashboard: TSection;
  users: TSection;
  premium_users: TSection;
  organizations: TSection;
  projects: TSection;
  services: TSection;
  chat_group: TSection;
  tasks: TSection;
  files: TSection;
  notifications: TSection;
  messages: TSection;
  photo_review: TSection;
  reports_bans: TSection;
  sales_agents: TSection;
  manage_admins: TSection;
};

export type TInsights = {
  notifications: {
    count: number;
    messages: string[];
  };
  logs: {
    count: number;
    entries: string[];
  };
  errors: {
    count: number;
    details: string[];
  };
  warnings: {
    count: number;
    details: string[];
  };
  userActivity: {
    activeUsers: number;
    newSignups: number;
    topActions: string[];
  };
  revenue: {
    totalRevenue: number;
    monthlyRevenue: number;
    topProducts: string[];
  };
  supportTickets: {
    openTickets: number;
    resolvedTickets: number;
    recentTickets: string[];
  };
  systemPerformance: {
    uptime: string;
    cpuUsage: number;
    memoryUsage: number;
  };
};
