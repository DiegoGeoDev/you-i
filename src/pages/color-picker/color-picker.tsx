import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import {
  ColorPickerWrapper,
  ColorPickerContent,
  ColorPicker as ColorPickerComponent,
  ColorPickerInput,
} from "@/components";

import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  color: z.string().nullable(),
});

function ColorPicker() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: null,
      // color: "",
    },
  });

  const colorWatch = form.watch("color");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description: values.color === null ? "null" : JSON.stringify(values),
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
              <Label>Color</Label>
              <Controller
                control={form.control}
                name="color"
                render={({ field }) => (
                  <ColorPickerWrapper
                    value={field.value}
                    onChange={field.onChange}
                    // disabled
                  >
                    <ColorPickerContent>
                      <ColorPickerComponent />
                      <ColorPickerInput />
                    </ColorPickerContent>
                  </ColorPickerWrapper>
                )}
              />
            </div>

            <span className="flex gap-4">
              <Button type="button" onClick={() => form.reset({ color: null })}>
                reset
              </Button>

              <Button
                type="button"
                onClick={() => form.setValue("color", "#fff")}
              >
                setValue
              </Button>

              <Button type="submit">Submit</Button>
            </span>

            <span className="block text-muted-foreground w-80">
              {colorWatch === null ? "null" : JSON.stringify(colorWatch)}
            </span>
          </form>
        </div>
      </Card>
    </section>
  );
}

export { ColorPicker };
