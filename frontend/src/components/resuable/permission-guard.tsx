import React from "react";
import { PermissionType } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";

type PermissionsGuardProps = {
  requiredPermission: PermissionType;
  children: React.ReactNode;
  showMessage?: boolean;
};

export default function PermissionGuard({
  requiredPermission,
  children,
  showMessage,
}: PermissionsGuardProps) {
  const { hasPermission } = useAuthContext();

  if (!hasPermission(requiredPermission)) {
    return (
      showMessage && (
        <div className="flex items-center justify-center text-muted-foreground p-4">
          You don't have the required permission.
        </div>
      )
    );
  }

  return <>{children}</>;
}
