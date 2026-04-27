import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import { queryClient } from "./config/query-client.ts";
import { userStateSetters } from "./core/users/state.ts";

import "./index.css";

userStateSetters.setAPIKey("buyer1-api-key-demo-retail-2026");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
