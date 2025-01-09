import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "@/components";

type ContextProvidersProps = {
  children: React.ReactNode;
};

function ContextProviders({ children }: ContextProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="you-i-theme">
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}

export { ContextProviders };
