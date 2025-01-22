import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import { ListRestart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import {
  OneToOneRelationshipWrapper,
  OneToOneRelationshipReset,
  OneToOneRelationshipContent,
  OneToOneRelationshipDraggableItems,
  OneToOneRelationshipDroppableItems,
} from "@/components";

import { useToast } from "@/hooks/use-toast";

import { inputItems, targetItems } from "./mock";

const formSchema = z.object({
  relationship: z
    .array(
      z.object({
        inputItem: z.object({ value: z.string(), label: z.string() }),
        targetItem: z.object({ value: z.string(), label: z.string() }),
      })
    )
    .nullable(),
});

function OneToOneRelationship() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // relationship: null,
      relationship: [
        {
          inputItem: { value: "input 4", label: "input 4" },
          targetItem: { value: "target 1", label: "target 1" },
        },
      ],
    },
  });

  const relationshipWatch = form.watch("relationship");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description:
        values.relationship === undefined
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
        <div className="grid place-items-center">
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-2"
          >
            <div className="space-y-2 w-[1200px]">
              <Label>One To One Relation</Label>
              <Controller
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <OneToOneRelationshipWrapper
                    value={field.value}
                    onChange={field.onChange}
                    // disabled
                  >
                    <OneToOneRelationshipReset />

                    <OneToOneRelationshipContent className="h-72">
                      <OneToOneRelationshipDraggableItems items={inputItems} />
                      <OneToOneRelationshipDroppableItems items={targetItems} />
                    </OneToOneRelationshipContent>
                  </OneToOneRelationshipWrapper>
                )}
              />
            </div>

            <span className="flex gap-4">
              <Button
                type="button"
                onClick={() => form.reset({ relationship: null })}
              >
                reset
              </Button>

              <Button
                type="button"
                onClick={() =>
                  form.setValue("relationship", [
                    {
                      inputItem: { value: "input 1", label: "input 1" },
                      targetItem: { value: "target 5", label: "target 5" },
                    },
                  ])
                }
              >
                setValue
              </Button>

              <Button type="submit">Submit</Button>
            </span>

            <span className="block text-muted-foreground w-[1000px]">
              {relationshipWatch === undefined
                ? "undefined"
                : JSON.stringify(relationshipWatch)}
            </span>
          </form>
        </div>
      </Card>
    </section>
  );
}

export { OneToOneRelationship };
