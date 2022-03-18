module.exports = () => {
  return {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      'postcss-px-to-viewport': {
        viewportWidth: 375,
        unitPrecision: 6,
        viewportUnit: 'vw',
        minPixelValue: 1,
        mediaQuery: true,
      },
    },
  };
};
