/**
 * Created by Amg on 2016/11/2.
 */

import md5 from 'md5';
import { commonCMD, videoCMD, postBI } from '../helper';

// 用户信息 md: 01
export class UserApi {

  // 登录 001
  static login(name, pwd) {
    return postBI(
      commonCMD({ fc: '001', uname: name, pwd: md5(pwd), en: 1 }),
      UserApi.login.name
    );
  }

  // 游客登录
  static loginWithGuest() {
    return UserApi.login(GUEST_NAME, GUEST_PWD);
  }

  // 刷新token(延长token有效期) 003
  static refreshToken() {
    return postBI(
      commonCMD({ fc: '003' }),
      UserApi.refreshToken.name
    );
  }

  // 登出 004
  static logout() {
    return postBI(
      commonCMD({ fc: '004' }),
      UserApi.logout.name
    );
  }

  // 获取用户信息 009
  static getUserInfo(token) {
    return postBI(
      commonCMD({ fc: '009', token }),
      UserApi.getUserInfo.name
    );
  }

  // 获取权限 012
  static authority() {
    return postBI(
      commonCMD({ mdl: '04', fc: '012', ptype: 2 }),
      UserApi.authority.name
    );
  }
}

// 直播间信息 md: 04
export class LiveVideoApi {
  // 获得所有直播间信息 001
  static getAllRoomsInfo() {
    return postBI(
      videoCMD({ fc: '001' }),
      LiveVideoApi.getAllRoomsInfo.name
    );
  }

  // 获得所有直播间直播状态 022
  static getAllRoomsStatus() {
    return postBI(
      videoCMD({ fc: '022' }),
      LiveVideoApi.getAllRoomsStatus.name
    );
  }

  // 单个直播间信息 002
  static getRoomInfo(roomid) {
    return postBI(
      videoCMD({ fc: '002', roomid }),
      LiveVideoApi.getRoomInfo.name
    );
  }
}

export class ConsultingApi {

  // 获得消息中心配置参数 023
  static getMessageCenterConfig() {
    return postBI(
      commonCMD({ fc: '023' }),
      ConsultingApi.getMessageCenterConfig.name
    );
  }
}
