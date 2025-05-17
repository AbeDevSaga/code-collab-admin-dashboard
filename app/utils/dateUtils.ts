export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getDaysRemaining = (targetDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const timeDiff = targetDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export const daysUntilDue = (dueDate: Date | string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  // Reset time components to compare only dates
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};