import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { RangeSlider as RangeSliderComponent } from "@/components";

import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  range: z.array(z.number(), z.number()),
});

function RangeSlider() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      range: [30, 66], // [30]
    },
  });

  const rangeWatch = form.watch("range");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description:
        values.range === undefined ? "undefined" : JSON.stringify(values),
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
            className="space-y-8"
          >
            <div className="space-y-4">
              <Label>Range</Label>
              <Controller
                control={form.control}
                name="range"
                render={({ field }) => (
                  <RangeSliderComponent
                    value={field.value}
                    onValueChange={field.onChange}
                    // label={(value) => <span>{value}℃</span>}
                    label={(value) => value}
                    labelPosition="bottom"
                    min={20}
                    max={80}
                    orientation="horizontal"
                    // inverted
                  />
                )}
              />
            </div>

            <span className="flex gap-4">
              <Button
                type="button"
                onClick={() => form.reset({ range: [20, 80] })}
              >
                reset
              </Button>

              <Button
                type="button"
                onClick={() => form.setValue("range", [55, 75])}
              >
                setValue
              </Button>

              <Button type="submit">Submit</Button>
            </span>

            <span className="block text-muted-foreground w-80">
              {rangeWatch === undefined
                ? "undefined"
                : JSON.stringify(rangeWatch)}
            </span>
          </form>
        </div>
      </Card>
    </section>
  );
}

export { RangeSlider };
