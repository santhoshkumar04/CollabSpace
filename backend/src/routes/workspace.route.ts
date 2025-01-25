import { Router } from "express";
import {
  changeWorkspaceMemberRoleController,
  createWorkspaceController,
  deleteWorkspaceByIdController,
  getAllWorkspacesUserIsMemberController,
  getWorkspacesAnalyticsController,
  getWorkspacesByIdController,
  getWorkspacesMemberController,
  updateWorkspaceByIdController,
} from "../controllers/workspace.controller";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspaceController);

workspaceRoutes.put(
  "/change/member/role/:id",
  changeWorkspaceMemberRoleController
);

workspaceRoutes.put("/update/:id", updateWorkspaceByIdController);

workspaceRoutes.delete("/delete/:id", deleteWorkspaceByIdController);

workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);

workspaceRoutes.get("/:id", getWorkspacesByIdController);

workspaceRoutes.get("/members/:id", getWorkspacesMemberController);

workspaceRoutes.get("/analytics/:id", getWorkspacesAnalyticsController);

export default workspaceRoutes;
