import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import {
  SearchAddressWrapper,
  SearchAddressContent,
  SearchAddressCommand,
} from "@/components";

import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  address: z
    .object({
      osm_id: z.number(),
      address: z
        .object({
          city: z.string().optional(),
          city_district: z.string().optional(),
          country: z.string().optional(),
          country_code: z.string().optional(),
          county: z.string().optional(),
          municipality: z.string().optional(),
          postcode: z.string().optional(),
          road: z.string().optional(),
          state: z.string().optional(),
        })
        .optional(),
      display_name: z.string(),
      type: z.string().optional(),
      x: z.number(),
      y: z.number(),
    })
    .nullable(),
});

function SearchAddress() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: null,
      // address: {
      //   osm_id: 264374,
      //   address: {
      //     country: "Brasil",
      //     country_code: "br",
      //     county: "Região Metropolitana do Vale do Paraíba e Litoral Norte",
      //     municipality: "Jacareí",
      //     state: "São Paulo",
      //   },
      //   display_name:
      //     "Jacareí, Região Imediata de São José dos Campos, Região Metropolitana do Vale do Paraíba e Litoral Norte, Região Geográfica Intermediária de São José dos Campos, São Paulo, Região Sudeste, Brasil",
      //   type: "administrative",
      //   x: -45.9723075,
      //   y: -23.3050682,
      // },
    },
  });

  const addressWatch = form.watch("address");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description:
        values.address === undefined ? "undefined" : JSON.stringify(values),
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
            <div className="flex flex-col gap-2">
              <Label>Place</Label>
              <Controller
                control={form.control}
                name="address"
                render={({ field }) => (
                  <SearchAddressWrapper
                    value={field.value}
                    onChange={field.onChange}
                    // className="w-80"
                    // disabled
                  >
                    <SearchAddressContent>
                      <SearchAddressCommand />
                    </SearchAddressContent>
                  </SearchAddressWrapper>
                )}
              />
            </div>

            <span className="flex gap-4">
              <Button
                type="button"
                onClick={() => form.reset({ address: null })}
              >
                reset
              </Button>

              <Button
                type="button"
                onClick={() =>
                  form.setValue("address", {
                    osm_id: 123,
                    address: {
                      country: "Brasil",
                      country_code: "br",
                      county: "qwerty",
                      municipality: "Jacareí",
                      state: "São Paulo",
                    },
                    display_name: "qwerty",
                    type: "administrative",
                    x: -45.9723075,
                    y: -23.3050682,
                  })
                }
              >
                setValue
              </Button>

              <Button type="submit">Submit</Button>
            </span>

            <span className="block text-muted-foreground w-[1000px]">
              {addressWatch === undefined
                ? "undefined"
                : JSON.stringify(addressWatch)}
            </span>
          </form>
        </div>
      </Card>
    </section>
  );
}

export { SearchAddress };
