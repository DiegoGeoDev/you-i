import React from "react";
import { Check, Clipboard } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

type CopyToClipboardProps = React.ComponentPropsWithoutRef<typeof Button> & {
  text: string;
};

const CopyToClipboard = React.forwardRef<
  React.ElementRef<typeof Button>,
  CopyToClipboardProps
>(({ text, disabled = false, className, ...props }, ref) => {
  const [copied, setCopiedState] = React.useState(false);

  const handleCopyToClipboard = () => {
    if (copied) return;
    navigator.clipboard.writeText(text);

    setCopiedState(true);
    setTimeout(() => {
      setCopiedState(false);
    }, 1000);
  };

  return (
    <Button
      ref={ref}
      size={"icon"}
      className={cn(className)}
      onClick={handleCopyToClipboard}
      {...props}
    >
      <Check
        size={16}
        data-is-copied={copied}
        className={`
            rotate-0 scale-100 transition-all invisible
            data-[is-copied=false]:-rotate-90 data-[is-copied=false]:scale-0
            data-[is-copied=true]:visible
          `}
      />
      <Clipboard
        size={16}
        data-is-copied={copied}
        className={`
            absolute rotate-90 scale-0 transition-all visible
            data-[is-copied=false]:-rotate-0 data-[is-copied=false]:scale-100
            data-[is-copied=true]:invisible
          `}
      />
    </Button>
  );
});
CopyToClipboard.displayName = "CopyToClipboard";

export { CopyToClipboard };
