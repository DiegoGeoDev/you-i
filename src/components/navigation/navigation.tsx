import { Link, useLocation } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { NavigationConfig } from "@/config";

import logoLight from "@/assets/you-i-logo-light.png";
import logoDark from "@/assets/you-i-logo-dark.png";
import { useIsDarkTheme } from "@/hooks/use-is-dark-theme";

type NavigationProps = {
  navigation: NavigationConfig[];
};

function Navigation({ navigation }: NavigationProps) {
  const location = useLocation();

  const isDarkTheme = useIsDarkTheme();

  return (
    <nav className="w-20 h-full flex flex-col items-center gap-4 border-border border-r">
      <picture className="h-20 w-20 grid place-items-center">
        <img
          className="w-10"
          src={isDarkTheme ? logoDark : logoLight}
          alt="Logo"
        />
      </picture>

      {navigation.map((item) => {
        if (item.type === "button") {
          const { id, path, title, pathTest } = item.data[0];

          return (
            <Link key={id} to={path}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    data-is-active={pathTest.test(location.pathname)}
                    className={`
                      h-10 w-10 rounded-full p-2
                      data-[is-active=true]:!text-primary-foreground
                      data-[is-active=true]:!bg-primary
                    `}
                  >
                    {item.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{title}</TooltipContent>
              </Tooltip>
            </Link>
          );
        } else if (item.type === "dropdown-menu") {
          const data = item.data.filter(
            (innerItem) => innerItem.isNavigationItem
          );

          if (data.length === 0) return null;

          const testPaths = item.data.map((innerItem) => innerItem.pathTest);
          const isSomeActive = testPaths.some((innerItem) =>
            innerItem.test(location.pathname)
          );

          return (
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  data-is-active={isSomeActive}
                  className={`
                    h-10 w-10 rounded-full p-2
                    data-[is-active=true]:!text-primary-foreground
                    data-[is-active=true]:!bg-primary
                  `}
                >
                  {item.icon}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="right">
                {data.map((innerItem) => {
                  const isActive = innerItem.pathTest.test(location.pathname);

                  return (
                    <DropdownMenuItem
                      key={innerItem.id}
                      disabled={isActive}
                      asChild
                    >
                      <Link
                        to={innerItem.path}
                        data-is-active={isActive}
                        className={`
                          data-[is-active=true]:!text-foreground 
                          data-[is-active=true]:!font-semibold 
                          data-[is-active=true]:!underline
                          data-[is-active=true]:!underline-offset-2
                        `}
                      >
                        {innerItem.title}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
      })}
    </nav>
  );
}

export { Navigation };
