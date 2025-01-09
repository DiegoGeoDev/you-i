import { useRef, useState } from "react";
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
  DrawSinglePointWrapper,
  DrawSinglePoint as DrawSinglePointButton,
  DrawSinglePointReset,
} from "@/components";

import { useToast } from "@/hooks/use-toast";
import { pointStyle, drawStyle } from "./ol-styles";

const formSchema = z.object({
  singlePoint: z.tuple([z.number(), z.number()]).optional(),
});

const mapId = "draw-single-point";

function DrawSinglePoint() {
  const mapRef = useRef(null);

  const [isActive, setIsActive] = useState(false);

  const handleActiveChange = (isActive: boolean) => {
    setIsActive(isActive);
  };

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // singlePoint: undefined,
      singlePoint: [-41.19758412569701, -16.26055046355725],
    },
  });

  const singlePointWatch = form.watch("singlePoint");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description:
        values.singlePoint === undefined ? "undefined" : JSON.stringify(values),
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
            <MapContainer
              ref={mapRef}
              id={mapId}
              className="[&>div]:rounded-md w-1/2 h-96"
            >
              <TileLayer source={openStreetMap} zIndex={0} />
              <DrawSinglePointWrapper
                className="absolute inset-4 z-10 h-min w-min"
                value={undefined}
                onChange={() => {}}
                mapRef={mapRef}
                pointStyle={pointStyle}
                zIndex={1}
                drawStyle={drawStyle}
                disabled={isActive}
              >
                <DrawSinglePointButton className="w-8 h-8 p-2 rounded-full" />
                <DrawSinglePointReset />
              </DrawSinglePointWrapper>
            </MapContainer>

            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-2"
            >
              <div className="space-y-2">
                <Label>Single Point</Label>
                <Controller
                  control={form.control}
                  name="singlePoint"
                  render={({ field }) => (
                    <DrawSinglePointWrapper
                      value={field.value}
                      onChange={field.onChange}
                      mapRef={mapRef}
                      pointStyle={pointStyle}
                      zIndex={1}
                      drawStyle={drawStyle}
                      isActive={isActive}
                      handleActiveChange={handleActiveChange}
                      // disabled
                    >
                      <DrawSinglePointButton placeholder="Desenhar Ponto" />
                      <DrawSinglePointReset />
                    </DrawSinglePointWrapper>
                  )}
                />
              </div>

              <Button type="submit">Submit</Button>

              <span className="block text-muted-foreground w-80">
                {singlePointWatch === undefined
                  ? "undefined"
                  : JSON.stringify(singlePointWatch)}
              </span>
            </form>
          </MapProvider>
        </div>
      </Card>
    </section>
  );
}

export { DrawSinglePoint };
