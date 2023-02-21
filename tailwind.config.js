// * Function to retain the opacity value for elements using custom theme variables
function withOpacity(cssVariable) {
    return ({ opacityValue }) => {
        if (opacityValue !== undefined) {
            return `rgba(${cssVariable}, ${opacityValue})`;
        }
        return `rgb(${cssVariable})`;
    };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                bgBase: withOpacity("var(--bgBase)"),
                bgLvl1: withOpacity("var(--bgLvl1)"),
                bgLvl2: withOpacity("var(--bgLvl2)"),
                txtBg: withOpacity("var(--txtBg)"),
                primary: withOpacity("var(--primary)"),
                txtPrimary: withOpacity("var(--txtPrimary)"),
                borderBase: withOpacity("var(--borderBase)"),
                borderPrimary: withOpacity("var(--borderPrimary)"),
                txtInfo: withOpacity("var(--txtInfo)"),
                bgInfo: withOpacity("var(--bgInfo)"),
                txtSuccess: withOpacity("var(--txtSuccess)"),
                bgSuccess: withOpacity("var(--bgSuccess)"),
                txtError: withOpacity("var(--txtError)"),
                bgError: withOpacity("var(--bgError)"),
            },
        },
    },
    plugins: [],
};
