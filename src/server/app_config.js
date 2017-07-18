/**
 * Created by Amg on 2016/11/3.
 */

import { Cookie, getSystem, ParamData } from '../ultils/tools';

export default class AppConfig {

  static systemType = () => getSystem();

  // TODO: 这里后期有机会还要优化下，参数都没了
  static localURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

  static isApp = ParamData.source === 'app';

  static isIntoStrategy = ParamData.jscl === 'true';

  static token = () => Cookie.getCookie('token');

  static roomid = () => parseInt(Cookie.getCookie('roomID'), 10);

  static userID = () => {
    const user = Cookie.getJSONCookie('user');
    if (user && user.uname !== 'cfkd01') return user.cid;

    const guest = Cookie.getJSONCookie('chat_guest');
    if (guest) return guest.cid;

    throw new Error('错误，无用户');
  };

  static chatPageSize = () => 10;
}

const screenHeight = document.documentElement.clientHeight;
const screenWidth = document.documentElement.clientWidth;
const headerHeight = AppConfig.isApp ? 0 : 40;
const navHeight = 40;
const qqCounsellorHeight = 30;
const msgInputHeight = 40;
const roomBoxHeight = screenHeight - headerHeight;
export const styleConfig = {
  screenHeight,
  screenWidth,
  headerHeight,
  roomBoxHeight,
  videoHeight: screenWidth / 2,
  navHeight,
  contentHeight: roomBoxHeight - (screenWidth / 2) - navHeight,
  chatContentHeight: (
    roomBoxHeight - (screenWidth / 2) - navHeight - qqCounsellorHeight - msgInputHeight
  ),
  qqCounsellorHeight,
  msgInputHeight,
  faceBoxHeight: screenHeight / 3,
};
