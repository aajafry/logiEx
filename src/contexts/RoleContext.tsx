import { createContext, ReactNode, useContext } from "react";

type RoleProviderProps = {
  children: ReactNode;
  allowedRole: string;
};

const RoleContext = createContext<string | undefined>(undefined);

export const useRole = (): string => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider.");
  }
  return context;
};

export function RoleProvider({ children, allowedRole }: RoleProviderProps) {
  return (
    <RoleContext.Provider value={allowedRole}>{children}</RoleContext.Provider>
  );
}
