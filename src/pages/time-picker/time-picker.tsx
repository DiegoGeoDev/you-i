import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import {
  TimePickerWrapper,
  TimePickerHours,
  TimePickerMinutes,
  TimePickerPeriod,
} from "@/components";

import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  time: z
    .object({
      hours: z.string(),
      minutes: z.string(),
      period: z.enum(["AM", "PM"]),
    })
    .optional(),
});

function TimePicker() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // time: undefined,
      time: {
        hours: "10",
        minutes: "15",
        period: "AM",
      },
    },
  });

  const timeWatch = form.watch("time");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "onSubmit",
      description:
        values.time === undefined ? "undefined" : JSON.stringify(values),
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
              <Label>Time</Label>
              <Controller
                control={form.control}
                name="time"
                render={({ field }) => (
                  <TimePickerWrapper
                    value={field.value}
                    onChange={field.onChange}
                    // disabled
                  >
                    <TimePickerHours />
                    <TimePickerMinutes />
                    <TimePickerPeriod />
                  </TimePickerWrapper>
                )}
              />
            </div>

            <Button type="submit">Submit</Button>

            <span className="block text-muted-foreground w-80">
              {timeWatch === undefined
                ? "undefined"
                : JSON.stringify(timeWatch)}
            </span>
          </form>
        </div>
      </Card>
    </section>
  );
}

export { TimePicker };
