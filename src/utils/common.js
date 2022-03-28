import qs from 'qs';
import axios from 'axios';
import router from '@/router';
import { Toast } from 'vant';

//验证手机号
export function isMobilePhone(val) {
  return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(val);
}

/**
 * 支付
 * @param {Object} payType  支付类型
 * @param {Object} payStatement  调起支付宝或微信的statment支付订单信息
 */
export const originPay = async (payType, payStatement, callback, errorCallback) => {
  /***判断支付通道****/
  //最终的支付通道
  let channel;
  /***
   * 用于标识支付通道：
   * "alipay" - 表示支付宝；
   * "wxpay" - 表示微信支付；
   */
  // alipay
  // wxpay
  // 取出支付宝和微信的支付通道
  plus.payment.getChannels(
    (channels) => {
      channels.map(item => {
        if (item.id === payType) {
          channel = item;
        }
      });
      if (!channel) {
        Toast('获取支付通道失败，请重试！');
      }
      plus.payment.request(
        channel,
        payStatement,
        (result) => {
          Toast('支付完成');
          callback();
        },
        (error) => {
          errorCallback(error);
        },
      );
    },
    (e) => {
      mui.toast(`获取支付通道列表失败：${e.message}`);
    },
  );
};

export const noOpen = () => {
  Toast('暂未开放');
};

export const logout = () => {
  localStorage.clear();
  router.push('/login');
};

/**
 * @description 375原型的px转换为vw
 * @author hys
 * @date 2020-02-04
 * @param {number} px
 * @returns {string}
 */
export const pxToVw = (px) => {
  const ratio = 375 / 100;
  const vw = `${(px / ratio).toFixed(6)}vw`;
  return vw;
};

/**
 * @description 375原型的px转换为显示屏幕的px
 * @param {number} px
 * @returns {number}
 */
export const pxToPxRatio = (px) => {
  const clientWidth = document.body.clientWidth;
  const pxRatio = px * (clientWidth / 375);
  return pxRatio;
};

/**
 * @description 显示原型的px转换为vw
 * @author hys
 * @date 2020-02-13
 * @param {number} px
 * @returns {string}
 */
export const pxToVwRatio = (px) => {
  const clientWidth =
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const ratio = clientWidth / 100;
  const vw = `${(px / ratio).toFixed(6)}vw`;
  return vw;
};

// 保留两位小数以及千分位的分隔符
export const priceFilter = (
  num,
  scale = 4,
  replenish = false,
) => {
  let str = toFixed(num, scale, replenish).toString();
  let res = str || '0';
  // 取小数部分
  let dot = '';
  const find = str.indexOf('.');
  if (find !== -1) {
    res = str.substring(0, find);
    dot = str.substring(str.length, find);
  }
  // 取到整数部分
  const intSum = res.replace(/\B(?=(?:\d{3})+$)/g, ',');
  const ret = intSum + dot;
  return ret;
};

// 处理数字小数位
// eslint-disable-next-line max-params
export const toFixed = (
  number,
  scale = 4,
  replenish = false,
  roundOff = true,
) => {
  let res = '';
  if (number) {
    let str = `${number}`;
    if (str.indexOf('e') > -1 || str.indexOf('E') > -1) {
      // 科学计数法
      let str = number.toFixed(scale + 1);
      res = str.substring(0, str.length - 1);
    } else if (str.indexOf('.') > -1) {
      // 小数
      if (scale === 0) {
        res = str.substring(0, str.indexOf('.'));
      } else {
        if (roundOff) {
          let resArr = res.toString().split('.');
          if (resArr[1]) {
            // 截取指定位数
            res = str.substring(
              0,
              str.indexOf('.') + scale + 1 + 1,
            );
            // 增加四舍五入功能
            res = accDiv(
              Math.round(
                accMul(Number(res), Math.pow(10, scale)),
              ),
              Math.pow(10, scale),
            ).toString();
          } else {
            // 截取指定位数
            res = str.substring(
              0,
              str.indexOf('.') + scale + 1,
            );
          }
        } else {
          // 截取指定位数
          res = str.substring(
            0,
            str.indexOf('.') + scale + 1,
          );
        }
      }
    } else {
      // 整数
      res = str;
    }
  }
  // 是否填充0
  if (replenish) {
    res = res || '0';
    let resArr = res.toString().split('.');
    if (resArr[1]) {
      let diff = scale - resArr[1].length;
      if (diff > 0) {
        let a = [];
        a.length = diff;
        a.fill(0);
        let pushStr = a.join('');
        res = res + pushStr;
      }
    } else {
      if (Number(scale)) {
        let a = [];
        a.length = scale;
        a.fill(0);
        let pushStr = a.join('');
        res = `${res}.${pushStr}`;
      }
    }
  }

  return res;
};

/**
 * 手机号码中间部分替换成指定符号
 *
 * @param {string} phone
 * @param {string} symbol 默认为`*`
 * @returns {string|*|XML|void}
 * @example
 *
 * formatPhone('15858264903');
 * // => 158****4903
 */
export const formatPhone = (phone, symbol) => {
  if (!symbol) symbol = '****';
  return phone
    .toString()
    .replace(/(\d{3})\d{4}(\d+)/, `$1${symbol}$2`);
};

// 是否为有效的密码(6-16位字母加数字组合，不能包含空格)
export const isValidPassword = (val) => {
  const reg =
    /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,16}$/;
  return reg.test(val);
};

export const judgePhone = () => {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1;
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isAndroid) {
    return 'A';
  }
  if (isIOS) {
    return 'S';
  }
  return false;
};

/**
 * 除法函数，用来得到精确的除法结果<br>
 * javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 *
 * @param {number} arg1
 * @param {number} arg2
 * @returns {number} arg1除以arg2的精确结果
 * @example
 *
 * accDiv(0.2, 0.3)
 * // => 0.6666666666666666
 */
export function accDiv(arg1, arg2) {
  let t1 = 0;
  let t2 = 0;
  let r1;
  let r2;

  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {}
  r1 = Number(arg1.toString().replace('.', ''));
  r2 = Number(arg2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

/**
 * 乘法函数，用来得到精确的乘法结果<br>
 * javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 *
 * @param {number} arg1
 * @param {number} arg2
 * @returns {number} arg1乘以arg2的精确结果
 * @example
 *
 * accMul(0.222, 0.3333)
 * // => 0.0739926
 */
export const accMul = (arg1 = 0, arg2 = 0) => {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();

  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace('.', '')) *
      Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  );
};

export const toNumber = (num) => {
  // 处理非数字
  if (isNaN(num)) return num;

  // 处理不需要转换的数字
  if (!/e/i.test(num.toString())) return num;

  return num.toFixed(18).replace(/\.?0+$/, '');
};

// 判断微信
export const isWeiXin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  let a = ua.match(/MicroMessenger/i);
  if (a && a[0] === 'micromessenger') {
    return true;
  } else {
    return false;
  }
};

// 判断QQ
export const isQQ = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (
    ua.indexOf(' qq') > -1 &&
    ua.indexOf('mqqbrowser') < 0
  ) {
    return true;
  } else {
    return false;
  }
};

/**
*
@description
价格简化
*
@param
{number}
price
价格
*
@param
{number}
fixed
小数位
*
@returns
{string}
简化后的价格
*/
export const reducePrice = (price, fixed = 2) => {
  let arr = [];
  let filterReplace = (arr) => {
    let res = `${price}`;
    arr.sort((a, b) => {
      return b.price - a.price;
    });
    let find = arr.findIndex((item) => {
      return price > item.price;
    });
    if (find !== -1) {
      let it = arr[find];
      res = `${toFixed(price / it.price, fixed)}${
        it.title
      }`;
    }
    return res;
  };
  // let locale = getLocale();
  let locale = 'zh_CN';
  if (locale === 'zh_CN') {
    arr = [
      {
        price: 10000,
        title: '万',
      },
      {
        price: 100000000,
        title: '亿',
      },
    ];
  } else {
    arr = [
      {
        price: 1000,
        title: 'K',
      },
      {
        price: 1000000,
        title: 'M',
      },
    ];
  }
  return filterReplace(arr);
};

export const http = (type, url, params, configs = {}) => {
  if (type === 'get' && params) {
    url = `${url}?${qs.stringify(params, {
      arrayFormat: 'indices',
    })}`;
    params = {};
  }
  let config = {
    ...configs,
  };
  if (type === 'file') {
    type = 'post';
    let formdata = new FormData();
    for (let [key, value] of Object.entries(params)) {
      formdata.append(key, value);
    }
    params = formdata;
    config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...configs,
    };
  }
  let response = axios[type](url, params, config);
  let thenCallback = () => {};
  let thenErrorCallback = () => {};
  let thenAllCallback = () => {};
  let catchCallback = () => {};
  let allCallback = () => {};
  response
    .then((res) => {
      if (res.code === 200) {
        thenCallback(res);
      } else {
        thenErrorCallback(res);
      }
      thenAllCallback(res);
      allCallback(res);
    })
    .catch((res) => {
      catchCallback(res);
      allCallback();
    });
  return {
    then(callback) {
      thenCallback = callback;
      return this;
    },
    thenError(callback) {
      thenErrorCallback = callback;
      return this;
    },
    thenAll(callback) {
      thenAllCallback = callback;
      return this;
    },
    catch(callback) {
      catchCallback = callback;
      return this;
    },
    all(callback) {
      allCallback = callback;
      return this;
    },
  };
};

// 保留两位小数以及千分位的分隔符
export const formatPrice = (
  num,
  scale = 4,
  replenish = false,
) => {
  let str = toFixed(num, scale, replenish).toString();
  let res = str || '0';
  // 取小数部分
  let dot = '';
  const find = str.indexOf('.');
  if (find !== -1) {
    res = str.substring(0, find);
    dot = str.substring(str.length, find);
  }
  // 取到整数部分
  const intSum = res.replace(/\B(?=(?:\d{3})+$)/g, ',');
  const ret = intSum + dot;
  return ret;
};
