/**
 * Created by Amg on 2016/11/1.
 */

import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { combineArray, arrayToObject, formatRoomStatus } from '../ultils/helper';
import { Cookie } from '../ultils/tools';
import { NONE, STATUS, NEED_NOT_AUDIT, ANALYST_ID } from '../server/define';
import chatInfo from './chat/reducer_chat';
import calendarInfo from './calendar/reducer_cal';
import newsInfo from './news/reducer_news';
import strategyInfo from './strategy/reducer_strategy';
import Authority from '../server/authority';
import * as ActionTypes from './action_types';
import AppConfig from '../server/app_config';

const chatGuest = Cookie.getJSONCookie('chat_guest');
const user = Cookie.getJSONCookie('user');
const isLoginUser = user && user.uname !== 'cfkd01';

function getUserNameFromCookie() {
  if (isLoginUser) return user.nickname || user.uname;
  if (chatGuest) return chatGuest.uname;
  return '访客用户';
}
const initAppState = {
  isLogin: false,
  // 聊天游客，一次获取，7天保持
  chatGuest: chatGuest || {},
  // 游客 、正常用户
  user: user || { isAnalyst: false, isRegister: false },
  displayUserName: getUserNameFromCookie(),
  isGetAuthority: false,
  authority: new Authority(),
  isGetAllRooms: false,
  allRooms: [],
  isGetRoomsStatus: false,
  roomsPlayingInfo: {},
  startRender: STATUS.start,
  platform: '',
  orgcode: '',
};

const roomID = parseInt(Cookie.getCookie('roomID') || NONE, 10);

const initRoomState = {
  isFirst: true,
  isGetRoomInfo: false,
  roomID,
  roomName: '',
  isaudit: NEED_NOT_AUDIT,
  isGetVideoInfo: false,
  vods: [],
  isYYPlayer: false,
  videoURL: '',
  site: '',
  authcode: '',
  qqList: [],
  chatAuthority: 0,
  marquee: '',
  aboutImg: '',
  maxonline: 0,
};

const longTime = 60 * 60 * 24 * 7; // 7天过期

let tokenTime = 30 * 60;
if (AppConfig.isApp) {
  tokenTime = longTime;
}

function appInfo(state = initAppState, action) {
  switch (action.type) {
    // 读取localStorage
    case REHYDRATE: {
      const lastAppInfo = action.payload.appInfo;
      if (lastAppInfo) {
        return {
          ...state,
          allRooms: lastAppInfo.allRooms,
        };
      }
      return state;
    }
    // 初始化app
    // case ActionTypes.REQUEST_APP_START: {
    //   return { ...state, startRender: STATUS.fetching };
    // }
    // 游客登录成功
    case ActionTypes.SUCCESS_LOGIN_WITH_GUEST: {
      const { token, ui, platform, orgcode } = action.data;
      const users = { ...ui, isAnalyst: ui.groupid === ANALYST_ID };
      Cookie.setCookie('token', token, { maxAge: tokenTime });
      Cookie.setCookie('user', users, { maxAge: tokenTime });
      return { ...state, user: users, platform, orgcode, isLogin: false };
    }
    // 游客登录失败
    case ActionTypes.FAILED_LOGIN_WITH_GUEST: {
      Cookie.deleteCookie('token');
      return state;
    }
    // 用token登录（获取用户信息）
    case ActionTypes.SUCCESS_LOGIN_WITH_TOKEN: {
      const users = { ...action.data, isAnalyst: action.data.groupid === ANALYST_ID };
      Cookie.setCookie('token', action.token, { maxAge: tokenTime });
      Cookie.setCookie('user', users, { maxAge: tokenTime });

      // 如果是游客token,未进行登录
      let isLogin = true;
      let name = users.nickname;
      if (!users.isRegister) {
        isLogin = false;
        name = state.displayUserName;
      }
      return { ...state, user: { ...users }, displayUserName: name, isLogin };
    }
    // 成功获取游客聊天名称
    case ActionTypes.SUCCESS_GET_GUEST_CHATNAME: {
      Cookie.setCookie('chat_guest', action.data, { maxAge: longTime });
      return { ...state, chatGuest: action.data, displayUserName: action.data.uname };
    }
    // 成功获取权限
    case ActionTypes.SUCCESS_GET_AUTHORITY: {
      return {
        ...state,
        authority: new Authority(action.data, state.user.grouptype),
        isGetAuthority: true,
        startRender: STATUS.success,
      };
    }
    // 获取所有房间成功
    case ActionTypes.SUCCESS_GET_ALL_ROOM: {
      const rooms = action.data.filter(i => parseInt(i.status, 10) === 1);
      const allRooms = rooms.map(room => ({
        ...room,
        isYYPlayer: parseInt(room.videotype, 10) === 1,
      }));
      return { ...state, allRooms, isGetAllRooms: true };
    }
    // 获取所有房间失败
    case ActionTypes.FAILED_GET_ALL_ROOM: {
      return { ...state, isGetAllRooms: true };
    }
    // 获取所有房间状态开始
    case ActionTypes.REQUEST_GET_ALL_ROOM_STATUS: {
      return { ...state, roomsPlayingInfo: {}, isGetRoomsStatus: false };
    }
    // 获取所有房间状态成功
    case ActionTypes.SUCCESS_GET_ALL_ROOM_STATUS: {
      const roomsPlayingInfo = formatRoomStatus(arrayToObject(action.data, 'roomid'));
      return { ...state, roomsPlayingInfo, isGetRoomsStatus: true };
    }
    // 获取所有房间状态失败
    case ActionTypes.FAILED_GET_ALL_ROOM_STATUS: {
      return { ...state, isGetRoomsStatus: true };
    }
    // token获取消息中心配置信息（账号密码登录直接有返回）
    case ActionTypes.SUCCESS_GET_MESSAGE_CONFIG_WITH_TOKEN: {
      return { ...state, platform: action.platform, orgcode: action.orgcode };
    }
    // 刷新Token
    case ActionTypes.SUCCESS_REFRESH_TOKEN: {
      try {
        const token = Cookie.getCookie('token');
        Cookie.setCookieExpireInSecond('token', token, tokenTime);
        const userCookie = Cookie.getCookie('user');
        Cookie.setCookieExpireInSecond('user', userCookie, tokenTime);
      } catch (e) {
        console.error(e, '更新Token时间失败!');
      }
      return state;
    }
    case ActionTypes.SUCCESS_LOGOUT: {
      Cookie.deleteCookie('user');
      return {
        ...state,
        isLogin: false,
        authority: new Authority(),
        displayUserName: state.chatGuest.uname,
      };
    }
    default:
      return state;
  }
}

function roomInfo(state = initRoomState, action) {
  switch (action.type) {
    // 获取房间信息成功
    case ActionTypes.SUCCESS_GET_ROOMINFO: {
      Cookie.setCookie('roomID', action.roomID);
      const {
        roomname: roomName,
        isaudit,
        demandname = [],
        demandurl = [],
        videotype,
        video: videoURL = '',
        name: site = '', // TODO: name实际是站点site参数,后台懒得改名
        command: authcode = '',
        qqno = [],
        qqtitle = [],
        charset: chatAuthority,
        marquee,
        comanypic: aboutImg,
        maxonline = 0,
      } = action.data;
      const vods = combineArray(demandname, demandurl);
      const qqList = combineArray(qqtitle, qqno);
      return {
        ...state,
        isGetRoomInfo: true,
        roomID: action.roomID,
        roomName,
        isaudit,
        isGetVideoInfo: true,
        vods,
        isYYPlayer: videotype === 1,
        videoURL,
        site,
        authcode,
        qqList,
        chatAuthority,
        marquee,
        aboutImg,
        maxonline,
      };
    }
    case ActionTypes.FAILED_GET_ROOMINFO: {
      return { ...state, isGetRoomInfo: true };
    }
    case ActionTypes.EXIT_ROOM: {
      Cookie.deleteCookie('roomID');
      return { ...state, roomID: NONE, roomName: '', isFirst: false };
    }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  appInfo,
  roomInfo,
  chatInfo,
  newsInfo,
  calendarInfo,
  strategyInfo,
});

export default rootReducer;

