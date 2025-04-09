import { RootState, AppDispatch } from "./store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  fetchPremiumUsers,
  fetchUserById,
  fetchUsersByOrganizationId,
} from "./slices/userSlice";
import {
  fetchOrganizations,
  fetchOrganizationById,
} from "./slices/orgSlice";
import {
  fetchServices,
  fetchServiceById,
} from "./slices/serviceSlice";
import {
  fetchAllProjects,
  fetchProjectById,
} from "./slices/projectSlice";
import { useEffect } from "react";
import React from "react";

// Helper function to check if data needs fetching
const shouldFetch = (data: any[] | null | undefined, loading: boolean) => {
  return !loading && (!data || data.length === 0);
};

// ==================== User Data Hook ====================
export const useUserData = () => {
  const { users, premiumUsers, loading, error } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch all users on mount if needed
  useEffect(() => {
    if (shouldFetch(users, loading)) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, users, loading]);

  // Fetch premium users on mount if needed
  useEffect(() => {
    if (shouldFetch(premiumUsers, loading)) {
      dispatch(fetchPremiumUsers());
    }
  }, [dispatch, premiumUsers, loading]);

  const getUserById = (userId: string) => {
    const user = users?.find(u => u._id === userId);
    if (!user && !loading) {
      dispatch(fetchUserById(userId));
    }
    return user;
  };

  const getUsersByOrganization = (orgId: string) => {
    const orgUsers = users?.filter(u => u.organization === orgId) || [];
    if (orgUsers.length === 0 && !loading) {
      dispatch(fetchUsersByOrganizationId(orgId));
    }
    return orgUsers;
  };

  return {
    users: users || [],
    premiumUsers: premiumUsers || [],
    getUserById,
    getUsersByOrganization,
    loading,
    error
  };
};
// export const useUserData = () => {
//   const { users, premiumUsers, loading, error } = useSelector((state: RootState) => state.user);
//   const dispatch = useDispatch<AppDispatch>();

//   const getAllUsers = React.useCallback(() => {
//     if (shouldFetch(users, loading)) {
//       dispatch(fetchAllUsers());
//     }
//   }, [dispatch, users, loading]);

//   const getPremiumUsers = React.useCallback(() => {
//     if (shouldFetch(premiumUsers, loading)) {
//       dispatch(fetchPremiumUsers());
//     }
//   }, [dispatch, premiumUsers, loading]);

//     const getUserById = (userId: string) => {
//     const user = users?.find(u => u._id === userId);
//     if (!user && !loading) {
//       dispatch(fetchUserById(userId));
//     }
//     return user;
//   };

//   const getUsersByOrganization = (orgId: string) => {
//     const orgUsers = users?.filter(u => u.organization === orgId) || [];
//     if (orgUsers.length === 0 && !loading) {
//       dispatch(fetchUsersByOrganizationId(orgId));
//     }
//     return orgUsers;
//   };

//   return {
//     users: users || [],
//     premiumUsers: premiumUsers || [],
//     loading,
//     error,
//     getAllUsers,
//     getPremiumUsers,
//     getUsersByOrganization,
//     getUserById,
//   };
// };

// ==================== Organization Data Hook ====================
export const useOrganizationData = () => {
  const { organizations, loading, error } = useSelector((state: RootState) => state.organization);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (shouldFetch(organizations, loading)) {
      dispatch(fetchOrganizations());
    }
  }, [dispatch, organizations, loading]);

  const getOrganizationById = (orgId: string) => {
    const org = organizations?.find(o => o._id === orgId);
    if (!org && !loading) {
      dispatch(fetchOrganizationById(orgId));
    }
    return org;
  };

  return {
    organizations: organizations || [],
    getOrganizationById,
    loading,
    error
  };
};

// ==================== Service Data Hook ====================
export const useServiceData = () => {
  const { services, loading, error } = useSelector((state: RootState) => state.service);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (shouldFetch(services, loading)) {
      dispatch(fetchServices());
    }
  }, [dispatch, services, loading]);

  const getServiceById = (serviceId: string) => {
    const service = services?.find(s => s._id === serviceId);
    if (!service && !loading) {
      dispatch(fetchServiceById(serviceId));
    }
    return service;
  };

  return {
    services: services || [],
    getServiceById,
    loading,
    error
  };
};

// ==================== Project Data Hook ====================
export const useProjectData = () => {
  const { projects, loading, error } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (shouldFetch(projects, loading)) {
      dispatch(fetchAllProjects());
    }
  }, [dispatch, projects, loading]);

  const getProjectById = (projectId: string) => {
    const project = projects?.find(p => p._id === projectId);
    if (!project && !loading) {
      dispatch(fetchProjectById(projectId));
    }
    return project;
  };

  return {
    projects: projects || [],
    getProjectById,
    loading,
    error
  };
};

// ==================== Combined Store Hook (Optional) ====================
export const useStore = () => {
  const userData = useUserData();
  const orgData = useOrganizationData();
  const serviceData = useServiceData();
  const projectData = useProjectData();

  return {
    users: userData,
    organizations: orgData,
    services: serviceData,
    projects: projectData,
  };
};