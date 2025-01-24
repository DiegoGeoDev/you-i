import { Card } from "@/components/ui/card";

import { CopyToClipboard as CopyToClipboardComponent } from "@/components";

function CopyToClipboard() {
  return (
    <section className="flex-1 flex px-6 pb-6">
      <Card className="flex-1 grid p-6">
        <div className="grid place-items-center">
          <CopyToClipboardComponent text="exemplo 123 copiado" />
        </div>
      </Card>
    </section>
  );
}

export { CopyToClipboard };
