"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { WeighthMeasurement } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface GraphCardProps {
  chartData: WeighthMeasurement[];
}

const GraphCard: React.FC<GraphCardProps> = ({ chartData }) => {
  const chartConfig = {
    time: {
      label: "Zeit",
    },
    weight: {
      label: "Gewicht",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  const selectData: { value: string; label: string; isDisabled?: boolean }[] = [
    { value: "today", label: "Heute" },
    { value: "last-watering", label: "Letzte Gießung", isDisabled: true },
    { value: "1-week", label: "1 Woche", isDisabled: true },
    { value: "1-month", label: "1 Monat", isDisabled: true },
    { value: "1-year", label: "1 Jahr", isDisabled: true },
    { value: "max", label: "Max", isDisabled: true },
  ];

  return (
    <Card className="col-start-1 row-start-2 lg:row-span-3 lg:col-span-2 md:col-start-1 md:row-start-2 md:row-span-2 md:col-span-2 sm:col-start-1 sm:row-start-2 sm:row-span-2 sm:col-span-2">
      <CardHeader>
        <CardTitle>Gewichtsverlauf</CardTitle>
        <CardDescription className="flex items-baseline justify-between gap-8">
          {!chartData.length ? (
            <p>Keine Daten für diesen Zeitraum vorhanden</p>
          ) : (
            <p>Entwicklung des Gewichtes des Topfes</p>
          )}
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Zeitraum wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectData.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    disabled={item?.isDisabled}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full min-h-[300px]"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="measuredAt"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = value;
                return date.toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="weight"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default GraphCard;
