"use client";
import React, { useEffect, useMemo } from "react";
import CountCard from "../components/CountCard";
import { statsData } from "../constants/dashboardStats";
import { useUserData } from "../redux/selectionFunctions";
import { getStatValue } from "../lib/helperFunctions";
import { useLoading } from "../context/LoadingContext";

function Dashboard() {
  const { 
    users, 
    premiumUsers,
    error,
  } = useUserData();
  const {setLoading} = useLoading(); // Assuming you have a loading context
  const [calculationsComplete, setCalculationsComplete] = React.useState(false);

  // Calculate derived data
  const activeUsers = useMemo(() => 
    users.filter(user => user.status === "active"), 
    [users]
  );
  
  // Memoize new users calculation
  const newUsers = useMemo(() => {
    if (users.length === 0) return [];
    const today = new Date().toISOString().split("T")[0];
    return users.filter(user => {
      const userCreatedAt = new Date(user.created_at).toISOString().split("T")[0];
      return userCreatedAt === today;
    });
  }, [users]);

  // Prepare stats data
  const updatedStatsData = useMemo(() => 
    statsData.map(stat => ({
      ...stat,
      value: getStatValue(stat.title, users, premiumUsers, activeUsers, newUsers)
    })),
    [users, premiumUsers, activeUsers, newUsers]
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setCalculationsComplete(true);
      setLoading(false);
    }, 0); // Using setTimeout to ensure memo completes
    
    return () => clearTimeout(timer);
  }, [updatedStatsData, setLoading]);

  // Handle error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!calculationsComplete) {
    return null;
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