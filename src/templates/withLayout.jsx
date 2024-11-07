import { RoleProvider } from "@/contexts";
import { Layout, ProtectedRoute } from "./index.js";

function withLayout(Component, allowedRole) {
  return (
    <RoleProvider allowedRole={allowedRole}>
      <ProtectedRoute>
        <Layout>
          <Component />
        </Layout>
      </ProtectedRoute>
    </RoleProvider>
  );
}

export { withLayout };
