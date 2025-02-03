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
  PlacePickerAdvancedAddress,
  PlacePickerAdvancedMapPoint,
  PlacePickerAdvancedPlace,
  PlacePickerAdvancedWrapper,
  placeTypeValues,
} from "@/components";

import { useToast } from "@/hooks/use-toast";

import { items } from "./mock";

const formSchema = z.object({
  place: z
    .object({
      placeID: z.string().optional(),
      address: z
        .object({
          district: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          country: z.string().optional(),
          zipCode: z.string().optional(),
        })
        .optional(),
      label: z.string().optional(),
      x: z.number(),
      y: z.number(),
      placeType: z.enum(placeTypeValues),
    })
    .nullable(),
});

const mapId = "place-picker-advanced-point";

function PlacePickerAdvanced() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // place: null,
      // place: {
      //   address: {},
      //   x: -51.18749463558197,
      //   y: -12.936351130149461,
      //   placeType: "MapPoint",
      // },
      place: {
        address: {
          district: "Região Metropolitana do Vale do Paraíba e Litoral Norte",
          state: "São Paulo",
          country: "Brasil",
        },
        label:
          "Jacareí, Região Imediata de São José dos Campos, Região Metropolitana do Vale do Paraíba e Litoral Norte, Região Geográfica Intermediária de São José dos Campos, São Paulo, Região Sudeste, Brasil",
        x: -45.9723075,
        y: -23.3050682,
        placeType: "Address",
      },
      // place: {
      //   placeID: "input 1",
      //   address: {},
      //   x: -47.75341786770615,
      //   y: -15.771052271331769,
      //   placeType: "Place",
      // },
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
        <div className="flex flex-col gap-4 place-items-center">
          <MapProvider mapId={mapId} center={undefined} zoom={undefined}>
            <MapContainer id={mapId} className="[&>div]:rounded-md w-1/2 h-60">
              <TileLayer source={openStreetMap} zIndex={0} />
            </MapContainer>

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
                    <PlacePickerAdvancedWrapper
                      value={field.value}
                      onChange={field.onChange}
                      items={items}
                      pointOptions={{
                        zIndex: 1,
                      }}
                    >
                      <PlacePickerAdvancedMapPoint
                        placeType="MapPoint"
                        placeholder="Adicionar manualmente"
                      />
                      <PlacePickerAdvancedAddress
                        placeType="Address"
                        placeholder="Pesquisar por um endereço"
                      />
                      <PlacePickerAdvancedPlace
                        placeType="Place"
                        placeholder="Selecionar um local predefinido"
                      />
                    </PlacePickerAdvancedWrapper>
                  )}
                />
              </div>

              <span className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => form.reset({ place: null })}
                  disabled
                >
                  reset
                </Button>

                <Button
                  type="button"
                  onClick={() => form.setValue("place", null)}
                  disabled
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
          </MapProvider>
        </div>
      </Card>
    </section>
  );
}

export { PlacePickerAdvanced };
