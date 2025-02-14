import App from "@/App";
import "@/index.css";
import { Toaster } from "@/shadcn/components/ui/sonner";
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <>
    {/* <StrictMode> */}
    <App />
    <Toaster richColors closeButton />
    {/* </StrictMode> */}
  </>
);
