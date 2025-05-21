"use client";
import React, { useEffect } from "react";
import NavItem from "./NavItem";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getFilteredSidebarItems } from "../lib/sidebarUtils";
import { TRole } from "../constants/type";
import Logo from "./Logo";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const user = useSelector((state: RootState) => state.auth.user);

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (!userRole) {
      router.push("/auth/login");
    }
  }, [userRole, router]);

  console.log("user: ", user);

  // Get filtered sidebar items based on the user's role
  const filteredSidebarItems = getFilteredSidebarItems(userRole as TRole);

  return (
    <div className="flex w-full flex-col h-full">
      {/* Logo Section */}
      <div className="bg-gray-100 p-4 border-b border-gray-200">
        <Link
          href="/"
          className="text-2xl font-bold text-white whitespace-nowrap"
        >
          <Logo />
        </Link>
      </div>

      {/* Scrollable Sidebar Items */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {filteredSidebarItems.map((item, index) => (
          <Link key={index} href={item.path} passHref>
            <NavItem
              icon={item.icons}
              text={item.label}
              active={pathname === item.path}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
