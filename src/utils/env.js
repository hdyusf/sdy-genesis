let devConfig = () => {
  return {
    url: 'http://172.18.3.2:8088/api',
    // url: 'http://172.18.1.64:8090/api',
    // url: '/api',
    tokenIdUrl: 'https://mumbai.polygonscan.com/token/',
  };
};

let prodConfig = () => {
  return {
    // url: 'http://172.18.1.92:8090/api',
    url: 'http://172.18.3.2:8088/api',
    tokenIdUrl: 'https://mumbai.polygonscan.com/token/',
  };
};

let targetConfig = {};
switch (process.env.NODE_ENV) {
  case 'development':
    targetConfig = devConfig();
    break;
  // case 'testing':
  //   targetConfig = testConfig();
  //   break;
  case 'production':
    targetConfig = prodConfig();
    break;
  default:
    targetConfig = prodConfig();
    break;
}

export default targetConfig;
