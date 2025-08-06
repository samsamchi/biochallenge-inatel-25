import { useSession } from "next-auth/react";
import React, { createContext, useContext, useMemo } from "react";

type ApiClient = {
  get: <T>(url: string) => Promise<T>;
  post: <T>(url: string, data: T) => Promise<T>;
  put: <T>(url: string, data: T) => Promise<T>;
  delete: (url: string) => Promise<unknown>;
};

const ApiContext = createContext<ApiClient | undefined>(undefined);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (session?.user?.email) {
      h["X-User-Email"] = session.user.email;
    }
    return h;
  }, [session]);

  const api: ApiClient = useMemo(
    () => ({
      get: async (url: string) => {
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
        return response.json();
      },
      post: async <T,>(url: string, data: T) => {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to post data to ${url}`);
        return response.json();
      },
      put: async <T,>(url: string, data: T) => {
        const response = await fetch(url, {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to update data at ${url}`);
        return response.json();
      },
      delete: async (url: string) => {
        const response = await fetch(url, {
          method: "DELETE",
          headers,
        });
        if (!response.ok) throw new Error(`Failed to delete data at ${url}`);
        return response.json();
      },
    }),
    [headers],
  );

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export const useApiContext = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApiContext must be used within an ApiProvider");
  return ctx;
};
