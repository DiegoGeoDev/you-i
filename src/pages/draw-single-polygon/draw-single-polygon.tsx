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
  DrawSinglePolygonWrapper,
  DrawSinglePolygon as DrawSinglePolygonButton,
  DrawSinglePolygonReset,
} from "@/components";

import { useToast } from "@/hooks/use-toast";
import {
  polygonStyle,
  // drawStyle,
  drawStyleFunction,
} from "./ol-styles";

const formSchema = z.object({
  singlePolygon: z.array(z.array(z.tuple([z.number(), z.number()]))).nullable(),
});

const mapId = "draw-single-polygon";

function DrawSinglePolygon() {
  const [isActive, setIsActive] = useState(false);

  const handleActiveChange = (isActive: boolean) => {
    setIsActive(isActive);
  };

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // singlePolygon: nll,
      singlePolygon: [
        [
          [-53.062498211860664, -19.53294142904184],
          [-49.93751013278961, -16.412266396127634],
          [-47.437508940696716, -19.97410489153522],
          [-53.062498211860664, -19.53294142904184],
        ],
      ],
    },
  });

  const singlePolygonWatch = form.watch("singlePolygon");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description:
        values.singlePolygon === undefined
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
                <Label>Single Polygon</Label>
                <Controller
                  control={form.control}
                  name="singlePolygon"
                  render={({ field }) => (
                    <DrawSinglePolygonWrapper
                      value={field.value}
                      onChange={field.onChange}
                      // disabled
                      polygonOptions={{
                        zIndex: 1,
                        style: polygonStyle,
                      }}
                      drawOptions={{
                        style: drawStyleFunction,
                      }}
                      isActive={isActive}
                      handleActiveChange={handleActiveChange}
                    >
                      <DrawSinglePolygonButton placeholder="Desenhar Polígono" />
                      <DrawSinglePolygonReset />
                    </DrawSinglePolygonWrapper>
                  )}
                />
              </div>

              <span className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => form.reset({ singlePolygon: null })}
                  disabled
                >
                  reset
                </Button>

                <Button
                  type="button"
                  onClick={() =>
                    form.setValue("singlePolygon", [
                      [
                        [-53.062498211860664, -19.53294142904184],
                        [-49.93751013278961, -16.412266396127634],
                        [-47.437508940696716, -19.97410489153522],
                        [-53.062498211860664, -19.53294142904184],
                      ],
                    ])
                  }
                  disabled
                >
                  setValue
                </Button>

                <Button type="submit">Submit</Button>
              </span>

              <span className="block text-muted-foreground w-80">
                {singlePolygonWatch === undefined
                  ? "undefined"
                  : JSON.stringify(singlePolygonWatch)}
              </span>
            </form>
          </MapProvider>
        </div>
      </Card>
    </section>
  );
}

export { DrawSinglePolygon };
