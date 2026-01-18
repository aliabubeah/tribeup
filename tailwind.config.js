/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                tribe: {
                    50: "#F2E9FC",
                    100: "#E5D3F8",
                    200: "#CCA7F1",
                    300: "#B27BEA",
                    400: "#994FE3",
                    500: "#59189A",
                    600: "#661CB0",
                    700: "#4C1584",
                    800: "#330E58",
                    900: "#19072C",
                    950: "#0D0316",
                },
            },
        },
    },
    plugins: [],
};
