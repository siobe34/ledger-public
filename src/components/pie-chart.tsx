"use client";

import type { ChartData } from "chart.js";
import {
  ArcElement,
  Chart as ChartJS,
  Colors,
  Filler,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import type { TypedChartComponent } from "node_modules/react-chartjs-2/dist/types";
import type { ComponentPropsWithoutRef } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Title, Tooltip, Legend, Filler, Colors);

interface IPieChartProps
  extends ComponentPropsWithoutRef<TypedChartComponent<"pie">> {
  data: ChartData<"pie">;
}
export const PieChart = ({ data, ...props }: IPieChartProps) => {
  return <Pie data={data} {...props} />;
};
