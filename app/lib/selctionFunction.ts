// Selector functions (to be used in components)
import { RootState } from "../redux/store";

// User-related selectors
export const selectAllUsers = () => (state: RootState) => {
  const { users } = state.user;
  return users;
};

export const makeSelectUsersByRole = (role: string) => {
  const selector = (state: RootState) =>
    state.user.users.filter((user) => user.role === role);

  return selector;
};

export const makeSelectUsersByStatus = (status: string) => {
  const selector = (state: RootState) =>
    state.user.users.filter((user) => user.status === status);

  return selector;
};

export const selectUsersByOrganization =
  (orgId: string) => (state: RootState) => {
    return state.user.users.filter((user) => user.organization === orgId);
  };

export const selectPremiumUsers = () => (state: RootState) => {
  const { premiumUsers } = state.user;
  return premiumUsers;
};

export const selectUserById = (userId: string) => (state: RootState) => {
  const { users } = state.user;
  return users.find((user) => user._id === userId);
};


// Organization-related selectors
export const selectAllOrganizations = () => (state: RootState) => {
  const { organizations } = state.organization;
  return organizations;
};

export const selectOrganizationById = (orgId: string) => (state: RootState) => {
  const { organizations } = state.organization;
  return organizations.find((org) => org._id === orgId);
};


// Service-related selectors
export const selectAllServices = () => (state: RootState) => {
  const { services } = state.service;
  return services;
};

export const selectServiceById = (serviceId: string) => (state: RootState) => {
  const { services } = state.service;
  return services.find((service) => service._id === serviceId);
};


// Project-related selectors
export const selectAllProjects = () => (state: RootState) => {
  const { projects } = state.project;
  return projects;
};

export const selectProjectById = (projectId: string) => (state: RootState) => {
  const { projects } = state.project;
  return projects.find((project) => project._id === projectId);
};

// export const selectProjectsByOrganization = (orgId: string) => (state: RootState) => {
//   const { projects } = state.project;
//   return projects.filter((project) => project.organization === orgId);
// };

// export const selectProjectsByService = (serviceId: string) => (state: RootState) => {
//   const { projects } = state.project;
//   return projects.filter((project) => project.service === serviceId);
// };

