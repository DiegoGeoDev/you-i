import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { MapProvider } from "@/components/map";
import {
  MapContainer,
  openStreetMap,
  TileLayer,
} from "@/components/map/components";

import {
  DrawSingleLineStringWrapper,
  DrawSingleLineString as DrawSingleLineStringButton,
  DrawSingleLineStringReset,
} from "@/components";

import { useToast } from "@/hooks/use-toast";
import { lineStringStyle, drawStyle } from "./ol-styles";

const formSchema = z.object({
  singleLineString: z.array(z.tuple([z.number(), z.number()])).nullable(),
});

const mapId = "draw-single-lineString";

function DrawSingleLineString() {
  const [isActive, setIsActive] = useState(false);

  const handleActiveChange = (isActive: boolean) => {
    setIsActive(isActive);
  };

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // singleLineString: nll,
      singleLineString: [
        [-53.062498211860664, -19.53294142904184],
        [-49.93751013278961, -16.412266396127634],
        [-47.437508940696716, -19.97410489153522],
      ],
    },
  });

  const singleLineStringWatch = form.watch("singleLineString");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description:
        values.singleLineString === undefined
          ? "undefined"
          : JSON.stringify(values),
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
        <div className="flex flex-col gap-4 place-items-center">
          <MapProvider mapId={mapId} center={undefined} zoom={undefined}>
            <MapContainer id={mapId} className="[&>div]:rounded-md w-1/2 h-96">
              <TileLayer source={openStreetMap} zIndex={0} />
            </MapContainer>

            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-2"
            >
              <div className="space-y-2">
                <Label>Single LineString</Label>
                <Controller
                  control={form.control}
                  name="singleLineString"
                  render={({ field }) => (
                    <DrawSingleLineStringWrapper
                      value={field.value}
                      onChange={field.onChange}
                      // disabled
                      LineStringOptions={{
                        zIndex: 1,
                        style: lineStringStyle,
                      }}
                      drawOptions={{
                        style: drawStyle,
                      }}
                      isActive={isActive}
                      handleActiveChange={handleActiveChange}
                    >
                      <DrawSingleLineStringButton placeholder="Desenhar Linha" />
                      <DrawSingleLineStringReset />
                    </DrawSingleLineStringWrapper>
                  )}
                />
              </div>

              <span className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => form.reset({ singleLineString: null })}
                  disabled
                >
                  reset
                </Button>

                <Button
                  type="button"
                  onClick={() =>
                    form.setValue("singleLineString", [
                      [-53.062498211860664, -19.53294142904184],
                      [-49.93751013278961, -16.412266396127634],
                      [-47.437508940696716, -19.97410489153522],
                    ])
                  }
                  disabled
                >
                  setValue
                </Button>

                <Button type="submit">Submit</Button>
              </span>

              <span className="block text-muted-foreground w-80">
                {singleLineStringWatch === undefined
                  ? "undefined"
                  : JSON.stringify(singleLineStringWatch)}
              </span>
            </form>
          </MapProvider>
        </div>
      </Card>
    </section>
  );
}

export { DrawSingleLineString };
