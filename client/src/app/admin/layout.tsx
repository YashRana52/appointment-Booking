"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { userAuthStore } from "@/store/authStore";
import { CreditCard, Icon, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, loading, logout } = userAuthStore();
  const router = useRouter();
  const pathName = usePathname();

  const [isChecking, setIsChecking] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const isLoginPage = pathName === "/admin/login";

  const navigationitems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      current: pathName === "/admin/dashboard",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: pathName === "/admin/users",
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
      current: pathName === "/admin/payments",
    },
  ];

  useEffect(() => {
    setHasMounted(true);

    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    if (isLoginPage) {
      setIsChecking(false);
      return;
    }

    if (loading) {
      setIsChecking(true);
      return;
    }

    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/admin/login");
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, user, loading, router, hasMounted, isLoginPage]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || isChecking) {
    return <Loader />;
  }

  if (!isAuthenticated || user?.type !== "admin") {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Title */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Portal
            </h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
          </div>

          {/* Logout */}
          <Button variant="outline" onClick={handleLogout} className="text-sm">
            Logout
          </Button>
        </div>

        {/* Navigation Tabs */}

        <nav className="border-t bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-6">
              {navigationitems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 py-3 text-sm border-b-2 transition
            ${
              item.current
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-600 hover:text-black hover:border-gray-400"
            }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
