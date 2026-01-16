import React from 'react'
import { Package, Puzzle, User } from "lucide-react";
import axios from 'axios';
import { withAuth } from '@/store/authStore';
import { Chat } from "@/views/Dashboard/chat"
import { Packages } from "@/views/Dashboard/packages"
import { Workspace } from "@/views/Dashboard/workspace"
import { Profile } from "@/views/Dashboard/settings"
export const staticConfig = {
  logo: "./assets/images/logo/logo.svg",
  legalName: "Uplift Inc",
  version: "0.0.1-beta",
  appName: "Operator Uplift",
  assistantName: "Uplift",
}

const iconClass =
  "h-full w-full ransition-colors text-foreground/50 group-hover:text-primary ";

export const links = [

  {
    title: staticConfig.assistantName,
    icon: (
      <img
        src="./assets/images/logo/logo.svg"
        width={20}
        height={20}
        alt={staticConfig.assistantName}
        className="h-full w-full"
      />
    ),
    href: "/chat",
    component: <Chat />
  },
  // {
  //   title: "Projects",
  //   icon: <Package className={iconClass} />,
  //   href: "/packages",
  //   component: <Packages />
  // },
  {
    title: "Workspace",
    icon: <Puzzle className={iconClass} />,
    href: "/workspace",
    component: <Workspace />
  },
  // {
  //   title: "Notifications",
  //   icon: <Bell className={iconClass} />,
  //   href: "/notifications",
  // },
  {
    title: "Profile",
    icon: <User className={iconClass} />,
    href: "/profile",
    component: <Profile />
  },
];


export const API_ENDPOINT = "https://api.operatoruplift.com"
export const API_INTERFACE = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include bearer token
API_INTERFACE.interceptors.request.use(
  async (config) => {
    // Get token with fallback strategy (store first, then Supabase)
    try {
      const token = await withAuth(async (_, token) => token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Unable to get auth token:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
API_INTERFACE.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 (Unauthorized) and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to get a fresh token
        const freshToken = await withAuth(async (_, token) => token);

        if (freshToken) {
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return API_INTERFACE(originalRequest);
        } else {
          // If we can't get a fresh token, the user needs to re-login
          const { useAuthStore } = await import('@/store/authStore');
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If refresh fails, logout the user
        const { useAuthStore } = await import('@/store/authStore');
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
