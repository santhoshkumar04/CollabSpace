import {
  AllWorkspaceResponseType,
  CurrentUserResponseType,
  LoginResponseType,
  loginType,
  registerType,
  WorkspaceByIdResponseType,
} from "@/types/api.type";
import API from "./axios-client";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/api/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (
  data: registerType
): Promise<{ message: string }> => {
  const res = await API.post("/api/auth/register", data);
  return res.data;
};

export const logoutMutationFn = async () => API.post("/api/auth/logout");

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/api/user/current`);
    return response.data;
  };

//********* WORKSPACE ****************
//************* */

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get("/api/workspace/all");
    return response.data;
  };

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(`/api/workspace/${workspaceId}`);
  return response.data;
};

export const createWorkspaceMutationFn = async () => {};

export const editWorkspaceMutationFn = async () => {};

export const getWorkspaceAnalyticsQueryFn = async () => {};

export const changeWorkspaceMemberRoleMutationFn = async () => {};

export const deleteWorkspaceMutationFn = async () => {};

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async () => {};

//********* */
//********* PROJECTS
export const createProjectMutationFn = async () => {};

export const editProjectMutationFn = async () => {};

export const getProjectsInWorkspaceQueryFn = async () => {};

export const getProjectByIdQueryFn = async () => {};

export const getProjectAnalyticsQueryFn = async () => {};

export const deleteProjectMutationFn = async () => {};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async () => {};

export const getAllTasksQueryFn = async () => {};

export const deleteTaskMutationFn = async () => {};
