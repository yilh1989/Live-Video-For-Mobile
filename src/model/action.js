/**
 * Created by Amg on 2016/11/1.
 */
import { UserApi, LiveVideoApi } from '../server/api/common_api';
import ChatApi from '../server/api/chat_api';
import * as ActionTypes from './action_types';
import { Cookie, ParamData } from '../ultils/tools';
import AppConfig from '../server/app_config';
import ConsultingApi from '../server/api/consulting_api';
import { requestChatRecord, toKeepOnline } from './chat/action_chat';
import Alert from '../component/alert/alert';
import User from '../views/user';

// 游客登录成功
function successLoginWithGuest(json) {
  return {
    type: ActionTypes.SUCCESS_LOGIN_WITH_GUEST,
    data: json.data,
  };
}

// 游客登录失败
function failedLoginWithGuest() {
  return {
    type: ActionTypes.FAILED_LOGIN_WITH_GUEST,
  };
}

// 以游客方式登录，刷新APP
function toLoginWithGuest() {
  return function wrap(dispatch) {
    return UserApi.loginWithGuest()
      .then((json) => {
        dispatch(successLoginWithGuest(json));
      })
      .catch(() => dispatch(failedLoginWithGuest()));
  };
}

// token登录成功
function successLoginWithToken(token, json) {
  return {
    type: ActionTypes.SUCCESS_LOGIN_WITH_TOKEN,
    token,
    data: json.data,
  };
}

// token登录
function toLoginWithToken(urlToken) {
  return function wrap(dispatch) {
    return UserApi.getUserInfo(urlToken)
      .then(json => dispatch(successLoginWithToken(urlToken, json)))
      .catch(() => dispatch(toLoginWithGuest())); // token 登录失败，使用游客登录
  };
}

// 获取消息中心信息成功
function successGetMessageConfigWithToken(json) {
  return {
    type: ActionTypes.SUCCESS_GET_MESSAGE_CONFIG_WITH_TOKEN,
    platform: json.data.platform,
    orgcode: json.data.orgcode,
  };
}

// 获取消息中心信息（token登录情况下）
function toGetMessageCenterConfig() {
  return function wrap(dispatch) {
    return ConsultingApi.getMessageCenterConfig()
      .then(json => dispatch(successGetMessageConfigWithToken(json)));
  };
}

// 登录
function toLoginApp() {
  return function wrap(dispatch) {
    const urlToken = ParamData.token;
    if (urlToken) {
      // token登录需要单独获取消息中心配置信息
      dispatch(toGetMessageCenterConfig());
      return dispatch(toLoginWithToken(urlToken));
    }
    return dispatch(toLoginWithGuest());
  };
}

// 获取权限成功
function successGetAuthority(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_AUTHORITY,
    obj,
    data: json,
  };
}

// 获取权限
function toGetAuthority(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return UserApi.authority()
      .then(json => dispatch(successGetAuthority(obj, json.data)));
  };
}

// 获取所有房间请求开始
function requestGetAllRoom() {
  return {
    type: ActionTypes.REQUEST_GET_ALL_ROOM,
  };
}

// 获取所有房间成功
function successGetAllRoom(data) {
  return {
    type: ActionTypes.SUCCESS_GET_ALL_ROOM,
    data,
  };
}

// 获取所有房间失败
function failedGetAllRoom() {
  return {
    type: ActionTypes.FAILED_GET_ALL_ROOM,
  };
}

// 获取所有房间
function toGetAllRoom() {
  return function wrap(dispatch) {
    dispatch(requestGetAllRoom());
    return LiveVideoApi.getAllRoomsInfo()
      .then(json => dispatch(successGetAllRoom(json.data)))
      .catch(() => dispatch(failedGetAllRoom()));
  };
}

// 获取所有房间直播状态请求开始
function requestGetAllRoomsStatus() {
  return {
    type: ActionTypes.REQUEST_GET_ALL_ROOM_STATUS,
  };
}

// 获取所有房间直播状态成功
function successGetAllRoomsStatus(data) {
  return {
    type: ActionTypes.SUCCESS_GET_ALL_ROOM_STATUS,
    data,
  };
}

// 获取所有房间直播状态失败
function failedGetAllRoomsStatus() {
  return {
    type: ActionTypes.FAILED_GET_ALL_ROOM_STATUS,
  };
}

// 获取房间直播状态
export function toGetAllRoomsStatus() {
  return function wrap(dispatch) {
    dispatch(requestGetAllRoomsStatus());
    return LiveVideoApi.getAllRoomsStatus()
      .then(json => dispatch(successGetAllRoomsStatus(json.data)))
      .catch(() => dispatch(failedGetAllRoomsStatus()));
  };
}

// 获取房间信息成功
function successGetRoomInfo(roomID, json) {
  return {
    type: ActionTypes.SUCCESS_GET_ROOMINFO,
    roomID,
    data: json.data[0],
  };
}

// 获取房间信息失败
function failedGetRoomInfo() {
  return {
    type: ActionTypes.FAILED_GET_ROOMINFO,
  };
}

// 获取房间信息
export function toGetRoomInfo(id = AppConfig.roomid()) {
  return function wrap(dispatch) {
    return LiveVideoApi.getRoomInfo(id)
      .then(json => dispatch(successGetRoomInfo(id, json)))
      .catch(() => dispatch(failedGetRoomInfo()));
  };
}

// 获取游客聊天昵称成功
function successGetGuestChatName(json) {
  return {
    type: ActionTypes.SUCCESS_GET_GUEST_CHATNAME,
    data: json,
  };
}

// 获取游客聊天昵称
function toGetGuestChatName() {
  return function wrap(dispatch) {
    return ChatApi.loginWithAnonymousUser()
      .then(json => dispatch(successGetGuestChatName(json)));
  };
}

// 获取游客聊天昵称外层处理
function toGetGuestChatNameWrap() {
  return function wrap(dispatch, getState) {
    // 如果是注册用户，则不用获取游客聊天昵称
    if (getState().appInfo.user.isRegister) {
      // if (Cookie.getCookie('user').isRegister) {
      return;
    }
    // 如果本地已经有cookie，永不重新获取聊天游客
    if (Cookie.getCookie('chat_guest') === null) {
      dispatch(toGetGuestChatName());
    }
    dispatch(successGetGuestChatName(Cookie.getJSONCookie('chat_guest')));
  };
}

// 用户更改时，重新初始化数据（获取房间ID后执行）
export function exchangeUser(dispatch) {
  dispatch(toGetRoomInfo());
  dispatch(requestChatRecord());
  dispatch(toGetAuthority());
  dispatch(toGetAllRoom());
  dispatch(toGetAllRoomsStatus());
  dispatch(toKeepOnline());
}

function requestAppStart() {
  return {
    type: ActionTypes.REQUEST_APP_START,
  };
}

// 程序启动
export function appStart() {
  return function wrap(dispatch) {
    dispatch(requestAppStart());
    return dispatch(toLoginApp())
      .then(() => dispatch(toGetAllRoom()))
      .then(() => {
        dispatch(toGetAllRoomsStatus());
        return dispatch(toGetAuthority());
      })
      .then(() => dispatch(toGetGuestChatNameWrap()));
  };
}

// 成功刷新token
function successRefreshToken(obj, json) {
  return {
    type: ActionTypes.SUCCESS_REFRESH_TOKEN,
    obj,
    data: json,
  };
}

// 刷新token（保持token有效）
export function toRefreshToken(obj) {
  return function wrap(dispatch) {
    return UserApi.refreshToken()
      .then(json => dispatch(successRefreshToken(obj, json)));
  };
}

// 退出房间
export function exitRoom() {
  return {
    type: ActionTypes.EXIT_ROOM,
  };
}

// 成功登出
function successLogout() {
  return {
    type: ActionTypes.SUCCESS_LOGOUT,
  };
}

// 用户登出
export function toLogoutApp(isTimeOut = false) {
  return function wrap(dispatch) {
    return UserApi.logout()
      .then(() => {
        if (isTimeOut) {
          let t = '';
          if (LOGIN_TIME_OUT_COUNT > 60) {
            t = `${parseInt(LOGIN_TIME_OUT_COUNT / 60, 10)}分钟`;
          } else {
            t = `${LOGIN_TIME_OUT_COUNT} 秒`;
          }
          Alert.show(`你已经超过${t}未做操作，请重新登录！`, undefined, undefined, undefined, () => {
            User.show(LOGIN_URL);
          });
        }
        dispatch(successLogout());
        return dispatch(toLoginWithGuest()); // 立马登录游客帐号
      })
      .then(exchangeUser(dispatch));
  };
}
