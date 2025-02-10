import SignIn from "@/page/auth/SignIn";
import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from "./routePaths";
import SignUp from "@/page/auth/SignUp";
import WorkspaceDashboard from "@/page/workspace/WorkspaceDashboard";
import Tasks from "@/page/workspace/Tasks";
import Members from "@/page/workspace/Members";
import Settings from "@/page/workspace/Settings";
import ProjectDetails from "@/page/workspace/ProjectDetails";
import InviteUser from "@/page/invite/InviteUser";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboard /> },
  { path: PROTECTED_ROUTES.TASKS, element: <Tasks /> },
  { path: PROTECTED_ROUTES.MEMBERS, element: <Members /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.PROJECT_DETAILS, element: <ProjectDetails /> },
];

export const baseRoutePath = [
  { path: BASE_ROUTE.INVITE_URL, element: <InviteUser /> },
];
