import { error } from "console";
import MemberModel from "../models/member.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException, UnauthorizedException } from "../utils/appError";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/role.enum";

export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("role");

  if (!member) {
    throw (
      (new UnauthorizedException("You are not a member of this workspace"),
      ErrorCodeEnum.ACCESS_UNAUTHORIZED)
    );
  }

  const roleName = member.role?.name;

  return { role: roleName };
};

export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  // Find workspace by invite code
  const workspace = await WorkspaceModel.findOne({ inviteCode });
  if (!workspace) {
    throw new NotFoundException("Invalid invite code or workspace not found");
  }

  //   Check if the user is already a member
  const existingMember = await MemberModel.findOne({ userId });
  if (existingMember) {
    throw new NotFoundException("You are already member of this workspace");
  }

  const role = await RoleModel.findOne({ name: Roles.MEMBER });
  if (!role) {
    throw new NotFoundException("Role not found");
  }

  //   Add user to workspace as a member
  const newMember = new MemberModel({
    userId,
    workspaceId: workspace._id,
    role: role._id,
  });

  await newMember.save();
  return {
    workspaceId: workspace._id,
    role: role.name,
  };
};
