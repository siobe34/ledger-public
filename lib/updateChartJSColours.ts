import { Chart as ChartJS } from "chart.js";

import { ITheme } from "../types/ITheme";

// * Func to update the colours of all ChartJS chart instances
export const updateChartJSColours = (currentTheme: ITheme["theme"]) => {
    // * Change default text colour based on the current theme
    // ? Can't use CSS variables with ChartJS so copy/pasted --txtBg values from globals.css
    ChartJS.defaults.color = currentTheme === "light" ? "rgb(20, 20, 20)" : "rgb(230, 230, 230)";

    // * Change default border colour based on the current theme
    // ? Can't use CSS variables with ChartJS so copy/pasted --borderBase values from globals.css
    ChartJS.defaults.borderColor = currentTheme === "light" ? "rgb(195, 195, 195)" : "rgb(75, 75, 75)";

    // * Change default background colour based on the current theme
    // ? Can't use CSS variables with ChartJS so copy/pasted --bgLvl1 values from globals.css
    ChartJS.defaults.backgroundColor = currentTheme === "light" ? "rgb(250, 250, 250)" : "rgb(33, 33, 33)";

    // * Loop over all active chart instances, update the colours, and call update() method on each chart
    Object.values(ChartJS.instances).forEach((chart) => {
        if (chart.options?.scales?.x?.ticks && chart.options?.scales?.x?.grid && chart.options?.scales?.y?.ticks && chart.options?.scales?.y?.grid) {
            // * Change the text colour for x and y axes of this specific chart instance based on the current theme
            // ? Can't use CSS variables with ChartJS so copy/pasted --txtBg values from globals.css
            chart.options.scales.x.ticks.color = currentTheme === "light" ? "rgb(20, 20, 20)" : "rgb(230, 230, 230)";
            chart.options.scales.y.ticks.color = currentTheme === "light" ? "rgb(20, 20, 20)" : "rgb(230, 230, 230)";

            // * Change the border colour for x and y axes of this specific chart instance based on the current theme
            // ? Can't use CSS variables with ChartJS so copy/pasted --borderBase values from globals.css
            chart.options.scales.x.grid.color = currentTheme === "light" ? "rgb(195, 195, 195)" : "rgb(75, 75, 75)";
            chart.options.scales.y.grid.color = currentTheme === "light" ? "rgb(195, 195, 195)" : "rgb(75, 75, 75)";
        }

        // * Update the specific chart instance
        chart.update();
    });
};
