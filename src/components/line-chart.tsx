"use client";

import type { ChartData } from "chart.js";
import {
  LineElement,
  PointElement,
  Chart as ChartJS,
  Colors,
  Filler,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import type { TypedChartComponent } from "node_modules/react-chartjs-2/dist/types";
import type { ComponentPropsWithoutRef } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors,
);

interface ILineChartProps
  extends ComponentPropsWithoutRef<TypedChartComponent<"line">> {
  data: ChartData<"line">;
}
export const LineChart = ({ data, ...props }: ILineChartProps) => {
  return <Line data={data} {...props} />;
};
