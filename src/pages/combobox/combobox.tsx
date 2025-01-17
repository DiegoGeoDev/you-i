import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import {
  ComboboxWrapper,
  ComboboxContent,
  ComboboxCommand,
} from "@/components";

import { useToast } from "@/hooks/use-toast";

import { items } from "./mock";

const formSchema = z.object({
  combobox: z.string().optional(),
});

function Combobox() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      combobox: undefined,
      // combobox: "input 4",
    },
  });

  const comboboxWatch = form.watch("combobox");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description:
        values.combobox === undefined ? "undefined" : JSON.stringify(values),
    });
  }

  function onError(errors: any) {
    console.log(errors);
    toast({
      variant: "destructive",
      title: "onError",
      description: JSON.stringify(errors),
    });
  }

  return (
    <section className="flex-1 flex px-6 pb-6">
      <Card className="flex-1 grid p-6">
        <div className="grid place-items-center">
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-2"
          >
            <div className="space-y-2">
              <Label>Combobox</Label>
              <Controller
                control={form.control}
                name="combobox"
                render={({ field }) => (
                  <ComboboxWrapper
                    value={field.value}
                    onChange={field.onChange}
                    items={items}
                    // disabled
                  >
                    <ComboboxContent>
                      <ComboboxCommand />
                    </ComboboxContent>
                  </ComboboxWrapper>
                )}
              />
            </div>

            <Button type="submit">Submit</Button>

            <span className="block text-muted-foreground w-80">
              {comboboxWatch === undefined
                ? "undefined"
                : JSON.stringify(comboboxWatch)}
            </span>
          </form>
        </div>
      </Card>
    </section>
  );
}

export { Combobox };
