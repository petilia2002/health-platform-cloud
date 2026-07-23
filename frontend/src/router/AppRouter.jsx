import { Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "../hoc/ProtectedRoute";
import UnAuthRoute from "../hoc/UnAuthRoute";
import { routes } from "./routes";

export default function AppRouter() {
  return (
    <Routes>
      {/* Публичные маршруты */}
      {routes.public.map(({ path, element: Component }) => (
        <Route key={path} path={path} element={<Component />}></Route>
      ))}
      {/* Маршруты только для неавторизованных */}
      {routes.unauth_only.map(
        ({ path, element: Component, layout: Layout }) => (
          <Route
            element={
              <UnAuthRoute>
                <Layout />
              </UnAuthRoute>
            }
          >
            <Route path={path} element={<Component />} />
          </Route>
        ),
      )}
      {/* Защищенные маршруты с ролями */}
      {routes.role_based.map(
        ({ path, element: Component, layout: Layout, roles = [] }) => (
          <Route
            element={
              <ProtectedRoute allowedRoles={roles}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path={path} element={<Component />} />
          </Route>
        ),
      )}
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
