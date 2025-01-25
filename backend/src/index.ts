import "dotenv/config";
import "./config/passport.config";
import cors from "cors";
import session from "cookie-session";
import passport from "passport";
import connectDatabase from "./config/database.config";
import authRoutes from "./routes/auth.route";
import express, { NextFunction, Request, Response } from "express";
import { config } from "./config/app.config";
import { HTTP_STATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({ origin: config.FRONTEND_ORIGIN, credentials: true }));

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTP_STATUS.OK).json({
      message: "Hello Subscribe to the channel & share",
    });
  })
);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
