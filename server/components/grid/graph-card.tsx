"use client";
import { CartesianGrid, XAxis, ComposedChart, Area, Bar } from "recharts";
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
import { Watering } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { ChartData } from "@/lib/utils";
import { de } from "date-fns/locale";

interface GraphCardProps {
  chartDataToday: ChartData;
  chartDataLastWatering?: ChartData;
  chartDataWeek?: ChartData;
  chartDataMonth?: ChartData;
  chartDataYear?: ChartData;
  chartDataMax?: ChartData;
  lastWaterings: Watering[];
}

import { format } from "date-fns";

export type filterTypes =
  | "today"
  | "last-watering"
  | "1-week"
  | "1-month"
  | "1-year"
  | "max";

const GraphCard: React.FC<GraphCardProps> = ({
  chartDataToday,
  lastWaterings,
  chartDataLastWatering,
  chartDataWeek,
  chartDataMonth,
  chartDataYear,
  chartDataMax,
}) => {
  const chartConfig = {
    time: {
      label: "Zeit",
    },
    weight: {
      label: "Gewicht",
      color: "hsl(var(--chart-4))",
    },
    watering: {
      label: "Gießung",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const selectData: { value: string; label: string; isDisabled?: boolean }[] = [
    { value: "today", label: "Heute" },
    {
      value: "last-watering",
      label: "Letzte Gießung",
      isDisabled: lastWaterings.length === 0,
    },
    { value: "1-week", label: "1 Woche" },
    { value: "1-month", label: "1 Monat" },
    { value: "1-year", label: "1 Jahr" },
    { value: "max", label: "Max" },
  ];

  const chartDataMap = {
    today: chartDataToday,
    "1-week": chartDataWeek,
    "1-month": chartDataMonth,
    "1-year": chartDataYear,
    max: chartDataMax,
    "last-watering": chartDataLastWatering,
  };

  const [filter, setFilter] = useState<filterTypes>(
    selectData.find((s) => s.value === "last-watering")?.isDisabled
      ? "today"
      : "last-watering"
  );
  const formatMap = {
    today: (date: Date) => format(date, "HH:mm", { locale: de }),
    "1-week": (date: Date) => format(date, "EEE HH:mm", { locale: de }),
    "1-month": (date: Date) => format(date, "dd.MM", { locale: de }),
    "1-year": (date: Date) => format(date, "MM.yyyy", { locale: de }),
    "last-watering": (date: Date) =>
      format(date, "dd.MM, HH:mm", { locale: de }) + " Uhr",
    max: (date: Date) => format(date, "MM.yyyy", { locale: de }),
  };

  const currentFormatter = formatMap[filter] ?? "dd:MM.yyyy";

  const chartData = chartDataMap[filter] ?? chartDataToday;

  return (
    <Card className="col-start-1 lg:row-span-3 lg:col-span-2 md:col-start-1 md:row-start-2 md:row-span-2 md:col-span-2 sm:col-start-1 sm:row-start-2 sm:row-span-2 sm:col-span-2 row-start-4 lg:row-start-2">
      <CardHeader>
        <CardTitle>Gewichtsverlauf</CardTitle>
        <CardDescription className="flex items-baseline justify-between gap-8">
          {!chartData?.length ? (
            <p>Keine Daten für diesen Zeitraum vorhanden</p>
          ) : (
            <p>Entwicklung des Gewichtes des Topfes</p>
          )}
          <Select
            value={filter}
            onValueChange={(value: filterTypes) => setFilter(value)}
          >
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
      <CardContent className="flex flex-col justify-center items-center h-full gap-8">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full min-h-[300px]"
        >
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return currentFormatter(date);
              }}
            />
            <ChartTooltip
              cursor={false}
              labelFormatter={(_, payload) => {
                const date = currentFormatter(payload[0].payload.date);
                return date;
              }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="weight"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Bar
              dataKey="watering"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default GraphCard;
