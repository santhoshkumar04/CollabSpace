import SignIn from "@/page/auth/SignIn";
import { AUTH_ROUTES } from "./routePaths";
import SignUp from "@/page/auth/SignUp";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
];
