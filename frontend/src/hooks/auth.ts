import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

export function useAuth() {
  const context = useContext(AuthContext)

  if(!context) {
    throw new Error('UseAuth is not in AuthProvider')
  }
  return context
}