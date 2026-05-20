
export default {
  content: [
    "./index.html",
    "./public/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
    "./scripts/**/*.js",
    "./structures/**/*.js"
  ],
  theme: {
    extend: {
      keyframes: {
        topSlide: {
          from: { transform: "translateY(-100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        rightSlide: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        topPop: "topSlide 700ms ease-in-out",
        rightPop: "rightSlide 700ms ease-in-out",
      },
    },
  },
};
