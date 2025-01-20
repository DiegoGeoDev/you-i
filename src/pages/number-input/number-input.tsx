import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { NumberInput as NumberInputComponent } from "@/components";

import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  number: z.string(),
});

function NumberInput() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // number: "",
      number: "10",
    },
  });

  const numberWatch = form.watch("number");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description:
        values.number === undefined ? "undefined" : JSON.stringify(values),
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
              <Label>Number</Label>
              <Controller
                control={form.control}
                name="number"
                render={({ field }) => (
                  <NumberInputComponent
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <Button type="submit">Submit</Button>

            <span className="block text-muted-foreground w-80">
              {numberWatch === undefined
                ? "undefined"
                : JSON.stringify(numberWatch)}
            </span>
          </form>
        </div>
      </Card>
    </section>
  );
}

export { NumberInput };
