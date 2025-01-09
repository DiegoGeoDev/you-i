import { useState } from "react";
import { useForm, Controller, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  TimePickerHours,
  TimePickerMinutes,
  TimePickerPeriod,
  TimePicker as TimePickerRoot,
  TimePickerValue,
} from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [timeForm, setTimeForm] = useState("{}");
  const [time, setTime] = useState<TimePickerValue | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setTimeForm(JSON.stringify(values));
  }

  const { field: field1 } = useController({
    name: "time",
    control: form.control,
  });

  const handleTimeChange1 = (value: TimePickerValue | undefined) => {
    field1.onChange(value);
  };

  return (
    <section className="flex-1 flex px-6 pb-6">
      <Card className="flex-1 grid p-6">
        <div className="flex flex-col gap-4">
          {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-2">
              <Label>Time (with a form - react hook form)</Label>
              <Controller
                control={form.control}
                name="time"
                render={({ field }) => (
                  <TimePickerRoot value={field.value} onChange={field.onChange}>
                    <TimePickerHours />
                    <TimePickerMinutes />
                    <TimePickerPeriod />
                  </TimePickerRoot>
                )}
              />
              <div className="space-x-2">
                <Button
                  type="button"
                  onClick={() => form.setValue("time", undefined)}
                >
                  Set Time
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    form.reset({
                      time: {
                        hours: "11",
                        minutes: "11",
                        period: "PM",
                      },
                    })
                  }
                >
                  Reset Time
                </Button>
              </div>
            </div>

            <Button type="submit">Submit</Button>

            <span className="block">{timeForm}</span>
          </form> */}

          <Separator />

          <div className="space-y-2">
            <Label>Time (without a form)</Label>
            <TimePickerRoot
              value={time}
              onChange={(value) => {
                console.log(value);
                setTime(value);
              }}
            >
              <TimePickerHours />
              <TimePickerMinutes />
              <TimePickerPeriod />
            </TimePickerRoot>

            <Button type="button" onClick={() => setTime(undefined)}>
              Reset Time
            </Button>

            <span className="block">{time ? JSON.stringify(time) : "{}"}</span>
          </div>

          <Separator />

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Tabs defaultValue="tab1" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tab1">tab1</TabsTrigger>
                <TabsTrigger value="tab2">tab2</TabsTrigger>
              </TabsList>

              <TabsContent value="tab1">
                <div className="space-y-2">
                  <Label>Time (with a form - react hook form)</Label>
                  <Controller
                    control={form.control}
                    name="time"
                    render={() => (
                      <TimePickerRoot
                        value={field1.value}
                        onChange={handleTimeChange1}
                      >
                        <TimePickerHours />
                        <TimePickerMinutes />
                        <TimePickerPeriod />
                      </TimePickerRoot>
                    )}
                  />
                  <div className="space-x-2">
                    <Button
                      type="button"
                      onClick={() => form.setValue("time", undefined)}
                    >
                      Set Time
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        form.reset({
                          time: {
                            hours: "11",
                            minutes: "11",
                            period: "PM",
                          },
                        })
                      }
                    >
                      Reset Time
                    </Button>
                  </div>
                </div>

                <Button type="submit">Submit</Button>

                <span className="block">{timeForm}</span>
              </TabsContent>

              <TabsContent value="tab2">123</TabsContent>
            </Tabs>
          </form>
        </div>
      </Card>
    </section>
  );
}

export { TimePicker };
