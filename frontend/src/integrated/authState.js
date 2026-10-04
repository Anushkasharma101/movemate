import { createContext, useContext } from "react";
export const Context = createContext(null);
export const useAuth = () => useContext(Context);
export const homeFor = (user) =>
  user.role === "coordinator" && user.approval !== "approved"
    ? "/coordinator/application"
    : `/${user.role}/dashboard`;
