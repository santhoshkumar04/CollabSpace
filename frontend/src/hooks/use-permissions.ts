import { PermissionType } from "@/constant";
import { UserType, WorkspaceWithMembersType } from "@/types/api.type";
import { useEffect, useMemo, useState } from "react";

export default function usePermissions(
  user: UserType | undefined,
  workspace: WorkspaceWithMembersType | undefined
) {
  const [permissions, setPermissions] = useState<PermissionType[]>([]);

  console.log(user, workspace, "up there");

  useEffect(() => {
    if (user && workspace && Array.isArray(workspace.members)) {
      const member = workspace.members.find(
        (member) => member.userId === user._id
      );
      if (member) {
        setPermissions(member.role.permissions || []);
      }
    }
  }, [user, workspace]);

  console.log(user, workspace);

  return useMemo(() => permissions, [permissions]);
}
