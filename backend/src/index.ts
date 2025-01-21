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
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";

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
