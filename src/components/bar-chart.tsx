"use client";

import type { ChartData } from "chart.js";
import {
  BarElement,
  CategoryScale,
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
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors,
);

interface IBarChartProps
  extends ComponentPropsWithoutRef<TypedChartComponent<"bar">> {
  data: ChartData<"bar">;
}
export const BarChart = ({ data, ...props }: IBarChartProps) => {
  return <Bar data={data} {...props} />;
};
