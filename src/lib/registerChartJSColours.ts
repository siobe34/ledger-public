import { Chart as ChartJS } from "chart.js";

export const registerChartJSColours = (activeTheme: "light" | "dark") => {
  ChartJS.defaults.color =
    activeTheme === "light" ? "hsl(0, 0%, 3.9%)" : "hsl(0, 0%, 98%)";
  ChartJS.defaults.borderColor =
    activeTheme === "light" ? "hsl(0, 0%, 89.8%)" : "hsl(0, 0%, 14.9%)";
  ChartJS.defaults.backgroundColor =
    activeTheme === "light" ? "hsl(0, 0%, 100%)" : "hsl(0, 4%, 5%)";

  // Loop over all active chart instances, update the colours, and call update() method on each chart
  Object.values(ChartJS.instances).forEach((chart) => {
    if (
      chart.options?.scales?.x?.ticks &&
      chart.options?.scales?.x?.grid &&
      chart.options?.scales?.y?.ticks &&
      chart.options?.scales?.y?.grid
    ) {
      // Update text colours
      chart.options.scales.x.ticks.color =
        activeTheme === "light" ? "hsl(0, 0%, 3.9%)" : "hsl(0, 0%, 98%)";
      chart.options.scales.y.ticks.color =
        activeTheme === "light" ? "hsl(0, 0%, 3.9%)" : "hsl(0, 0%, 98%)";

      // Update border colours
      chart.options.scales.x.grid.color =
        activeTheme === "light" ? "hsl(0, 0%, 89.8%)" : "hsl(0, 0%, 14.9%)";
      chart.options.scales.y.grid.color =
        activeTheme === "light" ? "hsl(0, 0%, 89.8%)" : "hsl(0, 0%, 14.9%)";
    }

    chart.update();
  });
};
