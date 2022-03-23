module.exports = {
  // important: true,
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blackTitle: '#000E2A',
        blackDefault: '#2E384D',
        blueDefault: '#4375FF',
        grayDefault: '#BABABA',
        grayTip: '#6C6C6C',
        grayBg: '#FAFAFA',
        grayCard: '#565B63',
        redTitle: '#E0260E',
        redLine: '#CC0909',
        redGradient: '#FFEDED',
        orangeTitle: '#C7804F',
        orangeTip: '#FC7C00',
        pinkButton: '#FFE5E5',
      },
      borderRadius: {
        lg2: '0.63rem',
        '2xl1': '1.13rem',
        '2xl2': '1.26rem',
      },
      borderWidth: {
        1: '1px',
      },
      fontSize: {
        xs2: ['0.815rem/* 13px */', '1.02rem/* 18px */'],
        xl2: ['1.38rem/* 22px */', '1.4rem/* 30px */'],
      },
      width: {
        4.5: '1.13rem',
        17: '4.5rem',
        21: '5.3rem',
      },
      height: {
        4.5: '1.13rem',
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
      },
      minWidth: {
        1: '1rem',
        2: '2rem',
        3: '3rem',
        4: '4rem',
      },
      maxWidth: {
        bai1: '6.25rem',
        bai2: '9.375rem',
        bai3: '12.5rem',
        bai4: '15.625rem',
      },
    },
  },
  plugins: [],
};
