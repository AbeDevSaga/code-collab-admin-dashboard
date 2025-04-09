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
  password: string;
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
  created_at: string;
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
  teamMembers?: {
    user: TUser;
    role: "admin" | "manager" | "developer" | "viewer";
    addedAt: Date;
    addedBy: TUser;
  }[];
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
  _id: string;
  name: string;
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
