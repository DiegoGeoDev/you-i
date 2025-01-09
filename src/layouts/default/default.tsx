import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

import { Header, Navigation } from "@/components";

import { NavigationConfig } from "@/config";

type DefaultProps = {
  navigation: NavigationConfig[];
};

function Default({ navigation }: DefaultProps) {
  return (
    <div className="flex h-screen">
      <Navigation navigation={navigation} />
      <main className="flex-1 w-full flex flex-col">
        <Header navigation={navigation} />
        <Outlet />
      </main>
      <Toaster />
      <SonnerToaster />
    </div>
  );
}

export { Default };
