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
