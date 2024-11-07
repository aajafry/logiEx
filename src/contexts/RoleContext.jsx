/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider.");
  }
  return context;
};

export function RoleProvider({ children, allowedRole }) {
  return (
    <RoleContext.Provider value={allowedRole}>{children}</RoleContext.Provider>
  );
}
