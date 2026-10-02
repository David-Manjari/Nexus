import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEMO_USERS } from "../roles";

const STORAGE_KEY = "nexus-auth-session";

const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredSession());

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = ({ email, password }) => {
    const account = DEMO_USERS.find(
      (member) =>
        member.email.toLowerCase() === String(email).trim().toLowerCase() &&
        member.password === String(password)
    );

    if (!account) {
      throw new Error("Invalid email or password.");
    }

    const sessionUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      roles: account.roles,
      department: account.department,
      active: account.active,
    };

    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
