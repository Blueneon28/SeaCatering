"use client";

import type React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Authentication Required"
        color="red"
      >
        Please log in to access this page.
      </Alert>
    );
  }

  if (adminOnly && user?.role !== "admin") {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Access Denied"
        color="red"
      >
        You don't have permission to access this page.
      </Alert>
    );
  }

  return <>{children}</>;
}
