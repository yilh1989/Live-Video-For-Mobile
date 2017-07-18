/**
 * Created by Amg on 2016/11/2.
 */

import 'fetch-ie8';
import AppConfig from './app_config';

const cmd = (id, d) => ({ en: 0, cmd: { md: id, token: AppConfig.token(), ...d } });

// 通用接口模块
const commonCMD = d => cmd('01', d);
// 视频直播接口模块
const videoCMD = d => cmd('04', d);
// 视频直播 需要房间ID参数
const wrapWithRoomID = obj => videoCMD({ ...obj, roomid: AppConfig.roomid() });

function ajax(url, obj, name, contentType = 'application/json') {
  const postData = (typeof obj === 'object') ? JSON.stringify(obj) : obj;
  return fetch(`${url}?${name}`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': contentType,
    },
    body: postData,
  }).then(res => res.json()).then((rs) => {
    if (DEBUG) {
      // 输出网络记录
      console.groupCollapsed(`[POST] [${name}] `, rs);
      console.log(`%c${postData}`, 'font-style:italic;color:#666');
      console.log(`%c${JSON.stringify(rs, null, '\t')}`, 'color:green');
      console.groupEnd();
    }

    if (
      (typeof rs.status !== 'undefined' && rs.status !== 0) ||
      (typeof rs.IsSuccess !== 'undefined' && !rs.IsSuccess) ||
      (typeof rs.code !== 'undefined' && rs.code !== 0)
    ) {
      console.error(`${name} 调用失败! ${JSON.stringify(rs)}`);
      throw new Error(rs.msg);
    }
    return rs;
  });
}

function postBI(obj, name = 'test') {
  return ajax(COMMEN_URL, obj, name);
}

function postIM(obj, name = 'test') {
  return ajax(CHAT_URL, obj, name);
}

function postC(url, obj, name) {
  return ajax(url, obj, name, 'application/x-www-form-urlencoded');
}

export { commonCMD, videoCMD, wrapWithRoomID, postBI, postIM, postC };
