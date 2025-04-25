import { TransformedTeamMember, TRole, TTeamMember, TUser } from "../constants/type";

// Helper function to get stat values
export const getStatValue = (
  title: string,
  users: any[],
  premiumUsers: any[],
  activeUsers: any[],
  newUsers: any[]
): string => {
  switch (title) {
    case "Total Users":
      return users.length.toString();
    case "Premium Users":
      return premiumUsers.length.toString();
    case "Active Users":
      return activeUsers.length.toString();
    case "New Users":
      return newUsers.length.toString();
    default:
      return "";
  }
};


export const transformTeamMembers = (
  teamMembers: TTeamMember[] | undefined
): TransformedTeamMember[] => {
  if (!teamMembers) return [];

  return teamMembers.map((member) => ({
    username: member.user.username,
    email: member.user.email,
    phone: member.user.phone || "",
    role: member.role,
    _id: member.user._id || "",
    teamMemberId: member._id || "",
    created_at: member.user.created_at || "",
    addedAt: new Date(member.addedAt).toLocaleDateString(),
    addedBy:
      typeof member.addedBy === "string"
        ? member.addedBy
        : member.addedBy.username,
  }));
};

