"use client";
import React, { useEffect, useMemo } from "react";
import CountCard from "../components/CountCard";
import { statsData } from "../constants/dashboardStats";
import { useLoading } from "../context/LoadingContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchAllUsers } from "../redux/slices/userSlice";
import { fetchAllProjects } from "../redux/slices/projectSlice";
import { TUser } from "../constants/type";
import { fetchOrganizations } from "../redux/slices/orgSlice";
import { fetchServices } from "../redux/slices/serviceSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartData
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

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
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          dispatch(fetchAllUsers()),
          dispatch(fetchAllProjects()),
          dispatch(fetchOrganizations()),
          dispatch(fetchServices()),
        ]);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch, setLoading]);

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
      const newUsersList = users.filter(
        (user) => user.created_at && new Date(user.created_at) > thirtyDaysAgo
      );

      // Service categories
      const premiumServicesList = services.filter(
        (service) => service.type === "premium"
      );

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
    projects.length,
  ]);

  // Line Graph Data (User Growth Over Time)
  const lineChartData: ChartData<"line"> = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "New Users",
        data: [15, 25, 32, 45, 52, 68, 74, 82, 90, 105, 120, newUsers.length],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        fill: true
      },
      {
        label: "Active Users",
        data: [50, 65, 78, 92, 110, 125, 140, 155, 170, 185, 200, activeUsers.length],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Bar Chart Data
  const barChartData: ChartData<"bar"> = {
    labels: [
      "Total Users",
      "Super Admins",
      "Organizations",
      "Org Users",
      "Public Users",
      "Premium Users",
      "Active Users",
      "New Users",
      "Services",
      "Premium Services",
      "Projects",
    ],
    datasets: [
      {
        label: "Count",
        data: [
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
          projects.length,
        ],
        backgroundColor: "#3b82f6",
        borderColor: "#1d4ed8",
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data (User Roles Distribution)
  const pieChartData: ChartData<"pie"> = {
    labels: ["Super Admins", "Admins", "Public Users", "Org Users", "New Users"],
    datasets: [
      {
        data: [
          superAdmins.length,
          admins.length,
          publicUsers.length,
          orgUsers.length,
          newUsers.length,
        ],
        backgroundColor: [
          "#3b82f6",
          "#60a5fa",
          "#93c5fd",
          "#bfdbfe",
          "#BBDEFB"
        ],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#374151",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        color: "#111827",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#374151"
        },
        grid: {
          color: "#e5e7eb"
        }
      },
      y: {
        ticks: {
          color: "#374151"
        },
        grid: {
          color: "#e5e7eb"
        },
        beginAtZero: true
      }
    }
  };

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!calculationsComplete || loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-2xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white p-6 space-y-8">
      {/* Count Cards Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {updatedStatsData.map((statdata) => (
            <CountCard key={statdata.title} stats={statdata} />
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Line Graph Section */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">User Growth Trend</h2>
          <div className="h-[30vh]">
            <Line 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Monthly User Growth",
                  },
                },
              }} 
              data={lineChartData} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bar Chart Section */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Statistics Overview</h2>
            <div className="h-[30vh]">
              <Bar
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: "All Statistics Comparison",
                    },
                  },
                }}
                data={barChartData}
              />
            </div>
          </div>

          {/* Pie Chart Section */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">User Distribution</h2>
            <div className="h-[30vh]">
              <Pie
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: "User Roles Breakdown",
                    },
                  },
                }}
                data={pieChartData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  
  );
}

export default Dashboard;