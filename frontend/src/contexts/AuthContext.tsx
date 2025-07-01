"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthContextType } from "../types";
import { LocalStorage } from "../utils/storage";
import {
  hashPassword,
  comparePassword,
  validateEmail,
  validatePassword,
} from "../utils/security";
import { v4 as uuidv4 } from "uuid";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }

    // Create default admin user if none exists
    const users = LocalStorage.get<User>("users");
    if (users.length === 0) {
      const adminUser: User = {
        id: uuidv4(),
        name: "Admin",
        email: "admin@seacatering.com",
        password: btoa("Admin123!" + "salt"), // Simple hash
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      LocalStorage.add("users", adminUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!validateEmail(email)) {
        return false;
      }

      const users = LocalStorage.get<User>("users");
      const user = users.find((u) => u.email === email);

      if (!user) {
        return false;
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return false;
      }

      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      if (!validateEmail(email)) {
        return false;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return false;
      }

      const users = LocalStorage.get<User>("users");
      const existingUser = users.find((u) => u.email === email);

      if (existingUser) {
        return false;
      }

      const hashedPassword = await hashPassword(password);
      const newUser: User = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      LocalStorage.add("users", newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
