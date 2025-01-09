import { Route, Routes } from "react-router-dom";

import { Default } from "@/layouts";
import { NotFound } from "@/pages";

import { navigationConfig } from "@/config";

const navigationItems = navigationConfig.flatMap((item) => item.data);

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Default navigation={navigationConfig} />}>
        <Route path="*" element={<NotFound />} />

        {navigationItems.map((item) => {
          if (item.path === "/") {
            return <Route key={item.id} index element={item.page} />;
          }

          return <Route key={item.id} path={item.path} element={item.page} />;
        })}
      </Route>
    </Routes>
  );
}

export { Router };
