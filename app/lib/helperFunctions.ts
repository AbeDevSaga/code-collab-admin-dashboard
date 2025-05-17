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

  return teamMembers.map((member) => {
    // Safe access to nested properties
    const user = member?.user || {};
    const addedBy = member?.addedBy || {};
    
    return {
      username: user?.username || 'Unknown',
      email: user?.email || '',
      phone: user?.phone || '',
      role: member?.role || '',
      _id: user?._id || '',
      teamMemberId: member?._id || '',
      created_at: user?.created_at || '',
      addedAt: member?.addedAt ? new Date(member.addedAt).toLocaleDateString() : '',
      addedBy: typeof addedBy === 'string' ? addedBy : addedBy?.username || ''
    };
  });
};

