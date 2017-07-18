/**
 * Created by Amg on 2016/11/1.
 */

import 'fetch-ie8';
import { wrapWithRoomID, postIM } from '../helper';
import AppConfig from '../app_config';
import { Cookie } from '../../ultils/tools';

export default class ChatApi {
  // 在线打卡 31
  static onlineCheck() {
    if (!AppConfig.roomid()) return Promise.resolve(); // TODO: 首次加载时，不进入online check;

    const user = Cookie.getJSONCookie('user');
    const chatGuest = Cookie.getJSONCookie('chat_guest');
    const isLoginUser = user && user.uname !== 'cfkd01';
    // 发送时，替换用户真实名为昵称,因为后台懒
    const obj = isLoginUser ? { ...user, uname: user.nickname } : chatGuest;
    return postIM(
      wrapWithRoomID({ fc: '031', ...obj }),
      'onlineCheck'
    );
  }

  // 发送聊天 32
  static postMessage(obj) {
    return postIM(
      wrapWithRoomID({ fc: '032', ...obj }),
      'postMessage'
    );
  }

  // 分页查询聊天记录 33
  static getMessages(pageindex) {
    return postIM(
      wrapWithRoomID({ fc: '033', pagesize: AppConfig.chatPageSize(), pageindex }),
      'getMessages'
    );
  }

  // 定时查询聊天记录 34
  static loopGetMessage(maxid) {
    return postIM(
      wrapWithRoomID({ fc: '034', maxid, uid: AppConfig.userID() }),
      'loopGetMessage'
    );
  }

  // 聊天审核 35
  static review(id) {
    return postIM(
      wrapWithRoomID({ fc: '035', id }),
      'review'
    );
  }

  // 定时查询审核的消息记录39
  static loopGetMessageAudit(pageindex, pagesize = 10) {
    return postIM(
      wrapWithRoomID({ fc: '039', pagesize, pageindex, type: 'm' }),
      'loopGetMessageAudit'
    );
  }

  // 获得游客账号38
  static loginWithAnonymousUser() {
    return postIM(
      wrapWithRoomID({ fc: '038' }),
      'loginWithAnonymousUser'
    );
  }
}

