import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import {
  PlacePickerWrapper,
  PlacePickerContent,
  PlacePickerMap,
} from "@/components";

import { useToast } from "@/hooks/use-toast";

import { pointStyle } from "./point-style";

const formSchema = z.object({
  place: z.tuple([z.number(), z.number()]).nullable(),
});

function PlacePicker() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      place: null,
      // place: [-41.19758412569701, -16.26055046355725],
    },
  });

  const placeWatch = form.watch("place");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description:
        values.place === undefined ? "undefined" : JSON.stringify(values),
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
              <Label>Place</Label>
              <Controller
                control={form.control}
                name="place"
                render={({ field }) => (
                  <PlacePickerWrapper
                    value={field.value}
                    onChange={field.onChange}
                    mapId="unique-identifier"
                    placeholder="Escolha um local"
                    // disabled
                  >
                    <PlacePickerContent>
                      <PlacePickerMap pointStyle={pointStyle} />
                    </PlacePickerContent>
                  </PlacePickerWrapper>
                )}
              />
            </div>

            <span className="flex gap-4">
              <Button type="button" onClick={() => form.reset({ place: null })}>
                reset
              </Button>

              <Button
                type="button"
                onClick={() => form.setValue("place", [-45, -23])}
              >
                setValue
              </Button>

              <Button type="submit">Submit</Button>
            </span>

            <span className="block text-muted-foreground w-80">
              {placeWatch === undefined
                ? "undefined"
                : JSON.stringify(placeWatch)}
            </span>
          </form>
        </div>
      </Card>
    </section>
  );
}

export { PlacePicker };
