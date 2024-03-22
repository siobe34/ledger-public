"use client";
import { Pie, Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors,
);

export default function ChartTest() {
  return (
    <div className="h-[500px] w-[500px]">
      {/* <Line
        data={{
          labels: ["February", "January", "December"],
          datasets: [{ data: [20, 500, 430], label: "Balances" }],
        }}
      /> */}
      <Bar
        data={{
          labels: [
            "Category 1",
            "Category 2",
            "Category 3",
            "Category 4",
            "Category 5",
          ],
          datasets: [
            {
              data: [20, 80, 100, 44, 98],
              label: "Testing",
              barThickness: 30,
              borderRadius: 3,
            },
            {
              data: [85, 209, 38, 44, 10],
              label: "Test 2",
              barThickness: 30,
              borderRadius: 3,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Monthly Categorical Spending By User",
            },
          },
        }}
      />
    </div>
  );
}
