import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import ProtectedRoute from './components/ProtectedRoute';
import { publicRoutes, protectedRoutes, type RouteItem } from './routes/routeConfig';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          {publicRoutes.map((route: RouteItem) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Protected role-based workspaces with nested routes */}
          {protectedRoutes.map((route: RouteItem) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedRoute roles={route.roles ?? []}>{route.element}</ProtectedRoute>}
            >
              {/* Child routes - rendered inside Outlet of parent WorkspaceLayout */}
              {route.children?.map((child) =>
                child.index ? (
                  <Route key={`${route.path}-index`} index element={child.element} />
                ) : (
                  <Route key={`${route.path}-${child.path}`} path={child.path} element={child.element} />
                ),
              )}
            </Route>
          ))}

          {/* Final catch-all redirect for unmapped routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;
