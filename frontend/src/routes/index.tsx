import BaseLayout from "@/layout/base.layout";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthRoute from "./auth.route";
import ProtectedRoute from "./protected.route";
import AppLayout from "@/layout/app.layout";
import NotFound from "@/page/error/NotFound";
import {
  authenticationRoutePaths,
  baseRoutePath,
  protectedRoutePaths,
} from "./common/routes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          {baseRoutePath.map((route, i) => (
            <Route key={i} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route path="/" element={<AuthRoute />}>
          <Route element={<BaseLayout />}>
            {authenticationRoutePaths.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {protectedRoutePaths.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
