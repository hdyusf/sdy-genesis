let devConfig = () => {
  return {
    url: 'http://172.18.3.2:8088/api',
    tokenIdUrl: 'https://mumbai.polygonscan.com/token/',
  };
};

let prodConfig = () => {
  return {
    // url: 'http://www.fsyun.vip/api',
    url: 'https://www.moonfs.shop/api',
    tokenIdUrl: 'https://mumbai.polygonscan.com/token/',
  };
};

let targetConfig = {};
switch (process.env.NODE_ENV) {
  case 'development':
    targetConfig = devConfig();
    break;
  case 'testing':
    targetConfig = devConfig();
    break;
  case 'production':
    targetConfig = prodConfig();
    break;
}

export default targetConfig;
