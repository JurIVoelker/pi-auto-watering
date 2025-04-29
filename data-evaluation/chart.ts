import { ChartJSNodeCanvas } from "chartjs-node-canvas/dist";
import * as path from "path";
import * as fs from "fs";

interface generateChartProps {
  height: number;
  width: number;
  labels: string[];
  data: number[];
}

export const generateBarChart = ({
  height,
  width,
  labels,
  data,
}: generateChartProps) => {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const configuration = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Value occurrences",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        background: {
          color: "white",
        },
      },
    },
    plugins: [
      {
        id: "background",
        // @ts-expect-error - It works, idc about the error
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.save();
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        },
      },
    ],
  };

  (async () => {
    // @ts-expect-error - It works, idc about the error
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    fs.writeFileSync(path.join(__dirname, "histogram.png"), image);
  })();
};

export const generateLineChart = ({
  height,
  width,
  labels,
  data,
}: generateChartProps) => {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const configuration = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Gewicht in Gramm",
          data,
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "category",
          title: {
            display: true,
            text: "Uhrzeit",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Gewicht in Gramm",
          },
        },
      },
      plugins: {
        background: {
          color: "white",
        },
      },
    },
    plugins: [
      {
        id: "background",
        // @ts-expect-error - It works, idc about the error
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.save();
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        },
      },
    ],
  };

  (async () => {
    // @ts-expect-error - It works, idc about the error
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    fs.writeFileSync(path.join(__dirname, "linechart.png"), image);
  })();
};
