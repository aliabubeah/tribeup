/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        fontFamily: {
            sans: ["Inter", "sans-serif"],
        },

        extend: {
            animation: {
                "spin-slow": "spin 3s linear infinite",
                "spin-fast": "spin 0.5s linear infinite",
            },
            colors: {
                tribe: {
                    50: "#F3E9FC",
                    100: "#E5D3F8",
                    200: "#CCA7F1",
                    300: "#B27BEA",
                    400: "#994FE3",
                    500: "#8023DC",
                    600: "#661CB0 ",
                    700: "#4C1584",
                    800: "#330E58",
                    900: "#1A072C",
                    950: "#0D0316",
                },
                neutral: {
                    50: "#F2F2F2",
                    100: "#E6E6E6",
                    200: "#CCCCCC",
                    300: "#B3B3B3",
                    400: "#999999",
                    500: "#7F7F7F",
                    600: "#666666",
                    700: "#4D4D4D",
                    800: "#333333",
                    900: "#1A1A1A",
                    950: "#0D0D0D",
                },
            },
        },
    },
    plugins: [],
};
