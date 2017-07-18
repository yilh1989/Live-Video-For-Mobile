/**
 * Created by fighter on 2016/9/28.
 */

import cookie from 'cookie';
import { IS_IOS, IS_ANDROID, IS_WINDOWS_PHONE } from '../server/define';

// 增加时间秒数
export function dateAddSeconds(sec) {
  return new Date((new Date()).getTime() + (sec * 1000));
}

// cookie处理
export class Cookie {
  static setCookie(name, val, option) {
    const v = (typeof val === 'string') ? val : JSON.stringify(val);
    document.cookie = cookie.serialize(name, v, option);
  }

  static setCookieExpireInSecond(name, val, second, option) {
    Cookie.setCookie(name, val, { expires: dateAddSeconds(second), ...option });
  }

  static getCookie(cName) {
    const p = cookie.parse(document.cookie);
    if (cName in p) {
      return p[cName];
    }
    return null;
  }

  static getJSONCookie(cName) {
    return JSON.parse(Cookie.getCookie(cName));
  }

  static deleteCookie(cName) {
    Cookie.setCookie(cName, '', { maxAge: -1 });
  }
}

export function dateFormat(d, format = 'yyyy-MM-dd') {
  if (!d) return '';
  let date = d;
  switch (typeof date) {
    case 'string':
      date = new Date(date.replace(/-/g, '/'));
      break;
    case 'number':
    default:
      date = new Date(date);
  }
  if (!(date instanceof Date)) return '';

  const dict = {
    yyyy: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    MM: (`${date.getMonth() + 101}`).substr(1),
    dd: (`${date.getDate() + 100}`).substr(1),
    HH: (`${date.getHours() + 100}`).substr(1),
    mm: (`${date.getMinutes() + 100}`).substr(1),
    ss: (`${date.getSeconds() + 100}`).substr(1),
  };
  try {
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, f => dict[f]);
  } catch (e) {
    return '';
  }
}

// 日期处理
export class Dates {
  static getNow(dateType) {
    const now = new Date();
    return dateFormat(now, dateType);
  }

  static getNowWeekNumber() {
    const week = new Date().getDay();
    let nowWeek = week;
    if (week === 0) nowWeek = 7;
    return nowWeek;
  }

  static getOneDayWeekWithDateObject(deltaDay = 0, dateType, weekType = [1, 2, 3, 4, 5, 6, 7]) {
    const oneDayLong = 24 * 60 * 60 * 1000;
    const now = new Date();
    const dayTime = now.getTime() + (deltaDay * oneDayLong);
    const day = new Date(dayTime);
    const weekDay = now.getDay() + deltaDay;
    const week = weekDay > 0 ? weekDay % 7 : 7 + (weekDay % 7);
    return {
      date: dateFormat(day, dateType),
      week: week === 0 ? weekType[6] : weekType[week - 1],
    };
  }

  static getThisWeek(start, dateType, weekType) {
    const today = new Date().getDay();
    const weekArray = [0, 1, 2, 3, 4, 5, 6];
    return weekArray.reduce((prev, next) => {
      prev.push(Dates.getOneDayWeekWithDateObject((next + start) - today, dateType, weekType));
      return prev;
    }, []);
  }

  static getThisWeekStartMondayArray(dateType, weekType) {
    return Dates.getThisWeek(1, dateType, weekType);
  }

  static getThisWeekStartSundayArray(dateType, weekType) {
    return Dates.getThisWeek(0, dateType, weekType);
  }
}

// 获取系统参数
export function getSystem() {
  const systemInfo = {
    isIpad: 'ipad',
    isIphoneOs: 'iphone os',
    isMidp: 'midp',
    isUc7: 'rv:1.2.3.4',
    isUc: 'ucweb',
    isAndroid: 'android',
    isCE: 'windows ce',
    isWM: 'windows mobile',
  };
  const userAgent = navigator.userAgent.toLowerCase();
  const s = { ...systemInfo };
  Object.keys(systemInfo).forEach((i) => {
    s[i] = userAgent.includes(systemInfo[i]);
  });
  if (s.isIpad || s.isIphoneOs) return IS_IOS;
  if (s.isMidp || s.isUc7 || s.isUc || s.isAndroid) return IS_ANDROID;
  if (s.isCE || s.isWM) return IS_WINDOWS_PHONE;
  return null;
}

// 获取地址栏参数，传入参数名，获取参数值
const GetParamData = () => {
  let str = location.href; // 取得整个地址栏
  const num = str.indexOf('?');
  str = str.substr(num + 1); // 取得所有参数   stringvar.substr(start [, length ]
  const arr = str.split('&'); // 各个参数放到数组里
  const paramData = {};
  for (let i = 0; i < arr.length; i += 1) {
    const n = arr[i].indexOf('=');
    if (n > 0) {
      const name = arr[i].substring(0, n);
      const value = decodeURIComponent(arr[i].substr(n + 1));
      paramData[name] = value;
    }
  }
  return paramData;
};
export const ParamData = new GetParamData();

// 倒计时
export const timer = (id, suc) => {
  let t = 60;
  const btn = document.getElementById(id);
  const timeCount = () => {
    if (t === 0) {
      clearTimeout(timeCount);
      t = 60;
      suc(true);
      btn.innerHTML = '获取验证码';
    } else {
      t -= 1;
      btn.innerHTML = `${t}s后重新获取`;
      suc(false);
      setTimeout(() => {
        timeCount();
      }, 1000);
    }
  };
  return timeCount();
};

// 回车事件
export const enterKey = (event, id) => {
  const e = event || window.event;
  if (e.keyCode === 13) {
    const btn = document.getElementById(id);
    e.preventDefault();
    btn.click();
  }
};
