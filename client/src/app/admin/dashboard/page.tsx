"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Users,
  UserCheck,
  Calendar,
  IndianRupee,
  UserCog,
  TrendingUp,
} from "lucide-react";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  CartesianGrid,
  AreaChart,
} from "recharts";

import { MonthlyRevenue, ReportData, DashboardStats } from "@/lib/types";
import { getWithAuth } from "@/service/httpService";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/dateUtills";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getWithAuth("admin/dashboard");
      const data = response.data;

      setStats({
        totalPatients: data.totalPatients,
        totalDoctors: data.totalDoctors,
        totalAppointments: data.totalAppointments,
        completedAppointments: data.completedAppointments,
        pendingAppointments: data.pendingAppointments,
        totalRevenue: data.totalRevenue,
      });

      setMonthlyRevenue(data.monthlyRevenue || []);
      setReport({
        userGrowth: data.userGrowth || [],
        appointmentStats: data.statusStats || [],
      });
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fixed data mapping
  const revenueData = monthlyRevenue.map((item) => ({
    month: new Date(item._id.year, item._id.month - 1).toLocaleString(
      "default",
      { month: "short" },
    ),
    revenue: item?.totalRevenue! || 0, // ← was 'revenue' before
  }));

  const appointmentData =
    report?.appointmentStats?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const userGrowthData =
    report?.userGrowth?.map((item) => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString(
        "default",
        { month: "short" },
      ),
      patients: item.totalUsers || 0, // ← was 'patients' before
    })) || [];

  // Empty state component
  const EmptyChart = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[300px] text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <TrendingUp className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">
        Data will appear here once available
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Doctors */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Doctors
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                {stats?.totalDoctors || 0}
              </h2>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <UserCheck className="text-blue-600" size={22} />
            </div>
          </CardContent>
        </Card>

        {/* Total Patients */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Patients
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                {stats?.totalPatients || 0}
              </h2>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <Users className="text-green-600" size={22} />
            </div>
          </CardContent>
        </Card>

        {/* Total Appointments */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Appointments
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                {stats?.totalAppointments || 0}
              </h2>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Calendar className="text-orange-600" size={22} />
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Revenue
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-purple-600">
                ₹{stats?.totalRevenue?.toLocaleString("en-IN") || 0}
              </h2>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <IndianRupee className="text-purple-600" size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue - Area Chart */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>
                  Revenue trend for the current year
                </CardDescription>
              </div>

              <div className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                ↑ 12.4%
                <span className="text-xs text-muted-foreground">
                  from last year
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="h-[340px]">
              {revenueData.length === 0 ? (
                <EmptyChart title="No revenue data yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#6366f1"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis dataKey="month" tickLine={false} axisLine={false} />

                    <YAxis
                      tickFormatter={formatCurrency}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value) => {
                        const amount = Number(value || 0);

                        return [
                          `₹${amount.toLocaleString("en-IN")}`,
                          "Revenue",
                        ];
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fill="url(#colorRevenue)"
                      dot={{ r: 4 }}
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appointment Status - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {appointmentData.length === 0 ? (
                <EmptyChart title="No appointments yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent! * 100).toFixed(0)}%`
                      }
                      labelLine
                    >
                      {appointmentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth - Bar Chart */}
        <Card className="border-0 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
          {/* Header */}
          <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  User Growth
                </CardTitle>

                <CardDescription>New patients per month</CardDescription>
              </div>

              <div className="text-xs text-muted-foreground">This year</div>
            </div>
          </CardHeader>

          {/* Chart */}
          <CardContent className="pt-6">
            <div className="h-[320px]">
              {userGrowthData.length === 0 ? (
                <EmptyChart title="No user growth data yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userGrowthData}
                    barGap={10}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    {/* Gradient */}
                    <defs>
                      <linearGradient
                        id="userGrowthGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#818cf8"
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                    </defs>

                    {/* Grid */}
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      strokeOpacity={0.15}
                    />

                    {/* X Axis */}
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tick={{ fill: "#6b7280" }}
                    />

                    {/* Y Axis */}
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tick={{ fill: "#6b7280" }}
                    />

                    {/* Tooltip */}
                    <Tooltip
                      cursor={{ fill: "rgba(99,102,241,0.08)" }}
                      formatter={(value) => {
                        const patients = Number(value ?? 0);
                        return [`${patients}`, "Patients"];
                      }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        fontSize: "13px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                      }}
                    />

                    {/* Bars */}
                    <Bar
                      dataKey="patients"
                      fill="url(#userGrowthGradient)"
                      radius={[12, 12, 0, 0]}
                      maxBarSize={42}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your platform efficiently</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">
            <Button
              onClick={() => router.push("/admin/users")}
              variant="outline"
              className="gap-2"
            >
              <UserCog className="h-4 w-4" />
              Manage Users
            </Button>

            <Button
              onClick={() => router.push("/admin/payments")}
              variant="outline"
              className="gap-2"
            >
              <IndianRupee className="h-4 w-4" />
              Process Payments
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
