/**
 * Created by Amg on 2016/11/1.
 */

import { arrayToObject, addIsAudit } from '../../ultils/helper';
import AppConfig from '../../server/app_config';

import * as ActionTypes from './action_types_chat';
import { STATUS } from '../../server/define';

const initChatState = {
  allRecord: {},
  mySendMsg: {},
  maxID: 0,
  pageIndex: 1,
  requestRecordNewTime: CHAT_RECORD_NEW_TIME,
  requestRecordAuditTime: CHAT_RECORD_AUDIT_TIME,
  scrollRunDirect: null,
  noMore: false,
  chatInfoStatus: STATUS.fetching,
};

export default function chatInfo(state = initChatState, action) {
  switch (action.type) {
    case ActionTypes.SUCCESS_GET_CHAT_RECORD: {
      const noRecord = action.data.length === 0 || JSON.parse(action.data).length === 0;
      const noMore = action.data.length < AppConfig.chatPageSize() ||
        JSON.parse(action.data).length < AppConfig.chatPageSize();
      const data = noRecord ? [] : JSON.parse(action.data);
      const formatRecord = addIsAudit(arrayToObject(data, 'id'));
      const maxID = data.length === 0 ? 0 : data[data.length - 1].id;
      return {
        ...state,
        allRecord: {
          ...formatRecord,
          ...state.mySendMsg[AppConfig.roomid()],
        },
        noMore,
        maxID,
        pageIndex: state.pageIndex + 1,
        scrollRunDirect: 'bottom',
        chatInfoStatus: STATUS.success,
      };
    }
    case ActionTypes.FAILED_GET_CHAT_RECORD: {
      return {
        ...state,
        noMore: true,
        chatInfoStatus: STATUS.fail,
      };
    }
    case ActionTypes.SUCCESS_GET_NEW_CHAT_RECORD: {
      const noMore = action.data.length === 0 || JSON.parse(action.data).length === 0;
      const data = noMore ? [] : JSON.parse(action.data);
      if (data.length !== 0) {
        return {
          ...state,
          allRecord: {
            ...state.allRecord,
            ...addIsAudit(arrayToObject(data, 'id')),
            ...state.mySendMsg[AppConfig.roomid()],
          },
          maxID: action.maxID,
          scrollRunDirect: 'bottom',
        };
      }
      return { ...state };
    }
    case ActionTypes.SUCCESS_GET_AUDIT_CHAT_RECORD_ID: {
      const allRecord = { ...state.allRecord };
      action.ids.forEach((id) => {
        // TODO: 后台返回的ids有的不存在之前请求回来的聊天记录数据中
        if (allRecord[id]) {
          allRecord[id].isAudit = false;
        }
      });
      return {
        ...state,
        allRecord: { ...allRecord },
      };
    }
    case ActionTypes.SUCCESS_GET_MORE_CHAT_RECORD: {
      // TODO: 后台返回数据存在空字符串""，跟空数组字符串"[]" 两种情况
      const noRecord = action.data.length === 0 || JSON.parse(action.data).length === 0;
      const noMore = action.data.length < AppConfig.chatPageSize() ||
        JSON.parse(action.data).length < AppConfig.chatPageSize();
      const data = noRecord ? [] : JSON.parse(action.data);
      return {
        ...state,
        allRecord: {
          ...addIsAudit(arrayToObject(data, 'id')),
          ...state.allRecord,
        },
        noMore,
        pageIndex: state.pageIndex + 1,
        scrollRunDirect: 'top',
      };
    }
    case ActionTypes.SUCCESS_AUDIT_MSG: {
      const newState = { ...state };
      const changedMsg = newState.allRecord[action.id];
      changedMsg.isAudit = false;
      return newState;
    }
    case ActionTypes.SUCCESS_SEND_MSG: {
      const mySendMsg = { ...state.mySendMsg };
      mySendMsg[AppConfig.roomid()] = mySendMsg[AppConfig.roomid()] || {};
      const {
        uid: custid,
        chatcontext: content,
        groupid,
        groupimg,
        groupname,
        uname: custname,
        isaudit,
      } = action.obj;
      mySendMsg[AppConfig.roomid()][action.json.id] = {
        custid,
        content,
        groupid,
        groupimg,
        groupname,
        isaudit,
        custname,
        roomid: AppConfig.roomid(),
        id: action.json.id,
        createtime: action.json.sendtime,
        isAudit: false,
      };
      return {
        ...state,
        mySendMsg,
        allRecord: {
          ...state.allRecord,
          ...mySendMsg[AppConfig.roomid()],
        },
        scrollRunDirect: 'bottom',
      };
    }
    case ActionTypes.START_SCROLL_RUN_TO: {
      return { ...state, scrollRunDirect: action.direction };
    }
    default:
      return state;
  }
}

