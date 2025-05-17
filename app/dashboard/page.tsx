"use client";
import React, { useEffect, useMemo } from "react";
import CountCard from "../components/CountCard";
import { statsData } from "../constants/dashboardStats";
import { useUserData } from "../redux/selectionFunctions";
import { getStatValue } from "../lib/helperFunctions";
import { useLoading } from "../context/LoadingContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchAllUsers } from "../redux/slices/userSlice";
import { fetchAllProjects } from "../redux/slices/projectSlice";
import { TUser } from "../constants/type";
import { fetchOrganizations } from "../redux/slices/orgSlice";
import { fetchServices } from "../redux/slices/serviceSlice";

function Dashboard() {
  const { setLoading } = useLoading();
  const [calculationsComplete, setCalculationsComplete] = React.useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const projects = useSelector((state: RootState) => state.project.projects);
  const organizations = useSelector((state: RootState) => state.organization.organizations);
  const services = useSelector((state: RootState) => state.service.services);
  
  const [admins, setAdmins] = React.useState<TUser[]>([]);
  const [superAdmins, setSuperAdmins] = React.useState<TUser[]>([]);
  const [publicUsers, setPublicUsers] = React.useState<TUser[]>([]);
  const [orgUsers, setOrgUsers] = React.useState<TUser[]>([]);
  const [premiumUsers, setPremiumUsers] = React.useState<TUser[]>([]);
  const [activeUsers, setActiveUsers] = React.useState<TUser[]>([]);
  const [newUsers, setNewUsers] = React.useState<TUser[]>([]);
  const [premiumServices, setPremiumServices] = React.useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllProjects());
    dispatch(fetchOrganizations());
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (users.length > 0 && services.length > 0) {
      // User categories
      const adminsList = users.filter((user) => user.role === "Admin");
      const superAdminsList = users.filter((user) => user.role === "Super Admin");
      const publicUsersList = users.filter((user) => user.role === "User");
      const orgUsersList = users.filter(
        (user) =>
          typeof user.role === "string" &&
          ["Project Manager", "Developer", "Team Member", "Super Admin"].includes(user.role)
      );
      const premiumUsersList = users.filter((user) => user.isPremium === true);
      const activeUsersList = users.filter((user) => user.status === "active");
      
      // Get users created in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newUsersList = users.filter((user) => 
        user.created_at && new Date(user.created_at) > thirtyDaysAgo
      );
      
      // Service categories
      const premiumServicesList = services.filter((service) => service.type === "premium");

      setAdmins(adminsList);
      setSuperAdmins(superAdminsList);
      setPublicUsers(publicUsersList);
      setOrgUsers(orgUsersList);
      setPremiumUsers(premiumUsersList);
      setActiveUsers(activeUsersList);
      setNewUsers(newUsersList);
      setPremiumServices(premiumServicesList);

      setCalculationsComplete(true);
    }
  }, [users, services]);

  const updatedStatsData = useMemo(() => {
    return statsData.map((stat) => {
      switch (stat.title) {
        case "Total Users":
          return { ...stat, value: `${users.length}` };
        case "Super Admins":
          return { ...stat, value: `${superAdmins.length}` };
        case "Organizations":
          return { ...stat, value: `${organizations.length}` };
        case "Organizational Users":
          return { ...stat, value: `${orgUsers.length}` };
        case "Public Users":
          return { ...stat, value: `${publicUsers.length}` };
        case "Premium Users":
          return { ...stat, value: `${premiumUsers.length}` };
        case "Active Users":
          return { ...stat, value: `${activeUsers.length}` };
        case "New Users":
          return { ...stat, value: `${newUsers.length}` };
        case "Services":
          return { ...stat, value: `${services.length}` };
        case "Premium Services":
          return { ...stat, value: `${premiumServices.length}` };
        case "Projects":
          return { ...stat, value: `${projects.length}` };
        default:
          return stat;
      }
    });
  }, [
    users.length,
    superAdmins.length,
    organizations.length,
    orgUsers.length,
    publicUsers.length,
    premiumUsers.length,
    activeUsers.length,
    newUsers.length,
    services.length,
    premiumServices.length,
    projects.length
  ]);

  // Handle error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!calculationsComplete) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
        {updatedStatsData.map((statdata, index) => (
          <CountCard key={statdata.title} stats={statdata} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;