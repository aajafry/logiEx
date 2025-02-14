import { RoleProvider } from "@/contexts";
import { Layout, ProtectedRoute } from "./index";
import { ComponentType } from "react";

function withLayout(Component: ComponentType, allowedRole: string) {
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
