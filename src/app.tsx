import { BrowserRouter } from "react-router-dom";

import { Router } from "@/router";

import { ContextProviders } from "@/components";

import "./index.css";

function App() {
  return (
    <ContextProviders>
      <BrowserRouter
        basename={"/youi"}
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <Router />
      </BrowserRouter>
    </ContextProviders>
  );
}

export { App };
