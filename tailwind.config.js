const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            transitionProperty: {
                height: "height",
            },
            colors: {
                petkit: {
                    dark: "#1d1d1d",
                },
            },
        },
    },

    plugins: [require("@tailwindcss/forms")],

    darkMode: "class",
};
