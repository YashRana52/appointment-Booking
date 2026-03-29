"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toLocalReadableDate, toLocalYMD } from "@/lib/dateUtills";
import { UserManagementUser } from "@/lib/types";
import { getWithAuth, putWithAuth } from "@/service/httpService";

import {
  CheckCircle2,
  Search,
  Stethoscope,
  User2,
  UserCheck,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

function User() {
  const [users, setUsers] = useState<UserManagementUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "patient" | "doctor">(
    "all",
  );

  const fetchUsers = async () => {
    try {
      const res = await getWithAuth("admin/users");

      setUsers(res.data.users || []);
      console.log("users", res.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean,
  ) => {
    try {
      await putWithAuth(`admin/users/${userId}/status`, {
        isActive: !currentStatus,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: !currentStatus } : user,
        ),
      );

      toast.success(
        `User ${currentStatus ? "deactivated" : "activated"} successfully`,
      );
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";

      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || user.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [users, searchTerm, filterType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* FILTER CARD - Modern & Clean */}
      <Card className="border-0 shadow-md rounded-2xl bg-white dark:bg-gray-900">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">
                Filter Users
              </CardTitle>

              <CardDescription className="text-sm mt-1">
                Search by name or email • Filter by user type
              </CardDescription>
            </div>

            <div className="text-sm text-muted-foreground font-medium">
              {filteredUsers.length} users
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              className="flex items-center gap-2 rounded-lg"
            >
              <Users size={16} />
              All Users
            </Button>

            <Button
              size="sm"
              variant={filterType === "patient" ? "default" : "outline"}
              onClick={() => setFilterType("patient")}
              className="flex items-center gap-2 rounded-lg"
            >
              <User2 size={16} />
              Patients
            </Button>

            <Button
              size="sm"
              variant={filterType === "doctor" ? "default" : "outline"}
              onClick={() => setFilterType("doctor")}
              className="flex items-center gap-2 rounded-lg"
            >
              <Stethoscope size={16} />
              Doctors
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* USERS TABLE  */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
        {/* Header */}
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            All Users
            <span className="text-sm text-muted-foreground font-normal">
              ({filteredUsers.length})
            </span>
          </CardTitle>

          <CardDescription>Manage user accounts and status</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-sm">
                {/* Table Head */}
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b">
                  <tr className="text-left text-gray-500 dark:text-gray-400">
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Verified</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
                      >
                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-md font-bold">
                              {user.name?.charAt(0)}
                            </div>

                            <span className="font-medium text-gray-900 dark:text-white">
                              {user.name.toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {user.email}
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className="capitalize font-medium text-gray-700 dark:text-gray-300">
                            {user.type}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              user.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Verified */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              user.isVerified
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {user.isVerified ? "Verified" : "Not Verified"}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {toLocalReadableDate(new Date(user.createdAt))}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          <Button
                            size="sm"
                            variant={user.isActive ? "destructive" : "default"}
                            onClick={() =>
                              handleToggleUserStatus(user.id, user.isActive!)
                            }
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-16 text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 text-gray-300" />

                          <p className="font-medium">No users found</p>

                          <p className="text-sm">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default User;
