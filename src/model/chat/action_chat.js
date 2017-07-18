/**
 * Created by Amg on 2016/11/1.
 */
import ChatApi from '../../server/api/chat_api';
import * as ActionTypes from './action_types_chat';

export function startScrollRun(direction = null) {
  return {
    type: ActionTypes.START_SCROLL_RUN_TO,
    direction,
  };
}

function successGetChatRecord(json) {
  return {
    type: ActionTypes.SUCCESS_GET_CHAT_RECORD,
    data: json.chartcon,
  };
}

export function requestChatRecord(index = 1) {
  return function wrap(dispatch) {
    return ChatApi.getMessages(index)
      .then(json => dispatch(successGetChatRecord(json)));
  };
}

function successGetNewChatRecord(json) {
  return {
    type: ActionTypes.SUCCESS_GET_NEW_CHAT_RECORD,
    data: json.chartcon,
    maxID: json.maxid,

  };
}

function failedGetNewChatRecord() {
  return {
    type: ActionTypes.FAILED_GET_NEW_CHAT_RECORD,
  };
}

export function requestNewChatRecord(maxID) {
  return function wrap(dispatch) {
    return ChatApi.loopGetMessage(maxID)
      .then((json) => dispatch(successGetNewChatRecord(json)))
      .catch(() => dispatch(failedGetNewChatRecord()));
  };
}

function successGetAuditChatRecordID(json) {
  return {
    type: ActionTypes.SUCCESS_GET_AUDIT_CHAT_RECORD_ID,
    ids: json.ids,
  };
}

function failedGetAuditChatRecordID() {
  return {
    type: ActionTypes.FAILED_GET_NEW_AUDIT_RECORD_ID,
  };
}

export function requestAuditChatRecordID(pageIndex) {
  return function wrap(dispatch) {
    return ChatApi.loopGetMessageAudit(pageIndex)
      .then((json) => dispatch(successGetAuditChatRecordID(json)))
      .catch(() => dispatch(failedGetAuditChatRecordID()));
  };
}

function successGetMoreChatRecord(json) {
  return {
    type: ActionTypes.SUCCESS_GET_MORE_CHAT_RECORD,
    data: json.chartcon,
  };
}

function failedGetMoreChatRecord() {
  return {
    type: ActionTypes.FAILED_GET_MORE_CHAT_RECORD,
  };
}

export function requestMoreChatRecord(pageIndex) {
  return function wrap(dispatch) {
    return ChatApi.getMessages(pageIndex)
      .then((json) => dispatch(successGetMoreChatRecord(json)))
      .catch(() => dispatch(failedGetMoreChatRecord()));
  };
}

function successAuditMsg(id) {
  return {
    type: ActionTypes.SUCCESS_AUDIT_MSG,
    id,
  };
}

function faliedAuditMsg() {
  return {
    type: ActionTypes.FAILED_AUDIT_MSG,
  };
}

export function requestAuditMsg(id) {
  return function wrap(dispatch) {
    return ChatApi.review(id)
      .then(() => dispatch(successAuditMsg(id)))
      .catch(() => dispatch(faliedAuditMsg()));
  };
}

function successSendMsg(obj, json) {
  return {
    type: ActionTypes.SUCCESS_SEND_MSG,
    obj,
    json,
  };
}

function failedSendMsg() {
  return {
    type: ActionTypes.FAILED_SEND_MSG,
  };
}

export function requestSendMsg(obj) {
  return function wrap(dispatch) {
    return ChatApi.postMessage(obj)
      .then((json) => dispatch(successSendMsg(obj, json)))
      .catch(() => dispatch(failedSendMsg()));
  };
}

// 在线打卡成功
function successKeepOnline() {
  return {
    type: ActionTypes.SUCCESS_KEEP_ONLINE,
  };
}

// 在线打卡
export function toKeepOnline() {
  return function wrap(dispatch) {
    return ChatApi.onlineCheck()
      .then(() => dispatch(successKeepOnline()));
  };
}

