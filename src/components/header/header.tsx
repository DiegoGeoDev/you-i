import { useLocation } from "react-router-dom";

import { Separator } from "@/components/ui/separator";

import { ModeToggle } from "@/components";

import { NavigationConfig } from "@/config";

type HeaderProps = {
  navigation: NavigationConfig[];
};

function Header({ navigation }: HeaderProps) {
  const location = useLocation();

  const currentNavigationItem = navigation
    .flatMap((item) => item.data)
    .find((innerItem) => innerItem.pathTest.test(location.pathname));

  const title =
    currentNavigationItem !== undefined
      ? currentNavigationItem.title
      : "Página não Encontrada";

  return (
    <header className="h-20 w-full px-6 py-3 flex items-center justify-between">
      <span className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
      </span>

      <div className="flex items-center gap-3">
        <Separator orientation="vertical" className="h-9" />
        <ModeToggle />
      </div>
    </header>
  );
}

export { Header };
