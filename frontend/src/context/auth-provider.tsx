import { PermissionType } from "@/constant";
import useAuth from "@/hooks/api/use-auth";
import useGetWorkspaceQuery from "@/hooks/api/use-get-workspace";
import usePermissions from "@/hooks/use-permissions";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { UserType, WorkspaceType } from "@/types/api.type";
import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router";

type AuthContextType = {
  user?: UserType;
  workspace?: WorkspaceType;
  hasPermission: (permission: PermissionType) => boolean;
  error: unknown;
  isLoading: boolean;
  isFetching: boolean;
  workspaceLoading: boolean;
  refetchAuth: () => void;
  refetchWorkspace: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  const {
    data: authdata,
    error: authError,
    isLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();

  const user = authdata?.user;

  const {
    data: workspaceData,
    isLoading: workspaceLoading,
    error: workspaceError,
    refetch: refetchWorkspace,
  } = useGetWorkspaceQuery(workspaceId);

  const workspace = workspaceData?.workspace;

  useEffect(() => {
    if (workspaceError) {
      if (workspaceError?.errorCode === "ACCESS_UNAUTHORIZED") {
        navigate("/");
      }
    }
  }, [navigate, workspaceError]);

  const permissions = usePermissions(user, workspace);

  const hasPermission = (permission: PermissionType): boolean => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        hasPermission,
        error: authError || workspaceError,
        isLoading,
        isFetching,
        workspaceLoading,
        refetchAuth,
        refetchWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUserContext must within a AuthProvider");
  }
  return context;
};
