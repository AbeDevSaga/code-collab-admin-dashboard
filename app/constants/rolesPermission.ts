import { TRole } from "./type";

export const rolesPermissions: Record<TRole, string[]> = {
  "Admin": [
    "dashboard",
    "users",
    "premium-users",
    "organizations",
    "services",
    "projects",
    "chat-group",
    "notifications",
    "messages",
    "reports-bans",
    "manage-admins",
  ],
  "Super Admin": [
    "dashboard",
    "users",
    "services",
    "projects",
    "chat-group",
    "notifications",
    "messages",
    "reports-bans",
    "manage-admins",
  ],
  "Project Manager": [
    "dashboard",
    "users",
    "projects",
    "chat-group",
    "notifications",
    "messages",
  ],
  "Developer": [
    "dashboard",
    "projects",
    "chat-group",
    "notifications",
  ],
  "Team Member": [
    "dashboard",
    "projects",
    "chat-group",
    "notifications",
  ],
  "User": [
    "dashboard",
    "projects",
    "chat-group",
    "notifications",
  ],
};