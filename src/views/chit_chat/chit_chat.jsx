/**
 * Created by Amg on 2016/10/31.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './chit_chat.scss';
import ChatRecord from './chat_record/chat_record';
import QQService from './qq_service/qq_service';
import ChatFace from './chat_face/chat_face';
import MsgInput from '../../component/msg_input/msg_input';
import { requestSendMsg } from '../../model/chat/action_chat';
import Tips from '../../component/tips/tips';
import { NEED_NOT_AUDIT, HAS_CHAT_AUTHORITY } from '../../server/define';
import { styleConfig } from '../../server/app_config';

@cssModules(styles, { allowMultiple: true, errorWhenNotFound: false })
export default class ChitChat extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    appInfo: PropTypes.object.isRequired,
    chatInfo: PropTypes.object.isRequired,
    roomInfo: PropTypes.object.isRequired,
    parentAudit: PropTypes.bool,
    viewMoreCallBack: PropTypes.func,
  };

  componentDidMount() {
    document.getElementById('contentBox').addEventListener('click', this.toClickBlank);
    this.msgInputBox.addEventListener('click', this.toFocusInput, false);
    this.showFaceBtn.addEventListener('click', this.toShowFace, false);
    this.toClickBlank();
  }

  componentWillUnmount() {
    document.getElementById('contentBox').removeEventListener('click', this.toClickBlank);
    this.toClickBlank();
  }

  top = (num) => {
    document.getElementById('contentBox').setAttribute('style',
      `-webkit-transform:translate(0,${num}px);-webkit-transition-duration: 0;` ||
      `-moz-transform:translate(0,${num}px);-moz-transition-duration: 0;` ||
      `-ms-transform:translate(0,${num}px);-ms-transition-duration: 0;` ||
      `-o-transform:translate(0,${num}px);-o-transition-duration: 0;` ||
      `transform:translate(0,${num}px);transition-duration: 0;`
    );
  };

  toClickBlank = () => {
    if (this.isFocusInput) this.msgInput.toBlur();
    if (this.isShowFace) ChatFace.close();
    this.isShowFace = false;
    this.isFocusInput = false;
  };

  toShowFace = (e) => {
    e.stopPropagation();
    if (this.props.roomInfo.chatAuthority !== HAS_CHAT_AUTHORITY) {
      Tips.show('您没有聊天权限！');
      return;
    }
    if (this.isFocusInput) this.msgInput.toBlur();
    if (!this.isShowFace) {
      this.isShowFace = true;
      this.top(-styleConfig.faceBoxHeight);
      ChatFace.show({
        insertFace: this.insertFace,
        footHeight: styleConfig.faceBoxHeight,
      });
    }
  };

  toFocusInput = (e) => {
    e.stopPropagation();
    if (this.props.roomInfo.chatAuthority !== HAS_CHAT_AUTHORITY) {
      Tips.show('您没有聊天权限！');
      return;
    }
    if (!this.msgInput.isFocus) this.msgInput.toFocus();
  };

  blurInputCallBack = () => {
    this.toClickBlank();
    this.isFocusInput = false;
  };

  focusInputCallBack() {
    if (this.isShowFace) ChatFace.close();
    document.body.scrollTop = document.body.scrollHeight;
    this.isShowFace = false;
    this.isFocusInput = true;
  }

  insertFace = (face) => {
    this.msgInput.insertFace(face);
  };

  checkValue = (val) => {
    let { msgText, msgHtml } = { ...val };
    msgText = msgText.replace(/(^\s*)|(\s*$)/g, '');
    msgHtml = msgHtml.replace(/(&nbsp;)/g, '').replace(/(^\s*)|(\s*$)/g, '');

    if (!msgText && msgHtml.indexOf('img') === -1) {
      Tips.show('发送消息不能为空');
      return false;
    }
    if (msgText.length > 300) {
      Tips.show('请不要输入太长的字符');
      return false;
    }
    return true;
  };

  sendMsg = () => {
    if (this.props.roomInfo.chatAuthority !== HAS_CHAT_AUTHORITY) {
      Tips.show('您没有聊天权限！');
      return;
    }
    const { msgText, msgHtml } = this.msgInput.getValue();
    if (this.checkValue({ msgText, msgHtml })) {
      const content = decodeURIComponent(msgHtml).replace(
        /<img.*?src=\"\/images\/(\d+)\.ico\".*?>/g, '[em_$1]' // eslint-disable-line
      );
      const sendContent = encodeURI(`<div>${content}</div>`);
      const {
        dispatch,
        appInfo: { isLogin, user, chatGuest = {}, displayUserName: uname },
      } = this.props;
      const { isAnalyst, groupid, groupimg, groupname } = user;
      const isaudit = isAnalyst ? NEED_NOT_AUDIT : this.props.roomInfo.isaudit;
      const uid = isLogin ? user.cid : chatGuest.cid;
      const requestData = {
        chatcontext: sendContent, groupid, groupimg, groupname, isaudit, uname, uid,
      };
      dispatch(requestSendMsg(requestData));
      this.msgInput.clearValue();
    }
  };

  render() {
    const {
      dispatch, appInfo, chatInfo, roomInfo, parentAudit, viewMoreCallBack,
    } = this.props;
    const { isAnalyst } = appInfo;
    const chatProps = { dispatch, parentAudit, isAnalyst, viewMoreCallBack, ...chatInfo };
    const hasChatAuthority = roomInfo.chatAuthority === HAS_CHAT_AUTHORITY;
    return (
      <div>
        <div styleName="chat-box" style={{ height: `${styleConfig.chatContentHeight}px` }}>
          <div styleName="record">
            <ChatRecord {...chatProps} />
          </div>
        </div>
        <div styleName="qq-counsellor" style={{ height: `${styleConfig.qqCounsellorHeight}px` }}>
          <ul>
            {
              roomInfo.qqList.map((item, idx) =>
                <QQService key={idx} qqInfo={item} />
              )
            }
          </ul>
        </div>
        <div
          styleName="msg-wrap"
          style={{ height: `${styleConfig.msgInputHeight}px` }}
        >
          <div styleName="msg-box">
            <div styleName="show-face-box" >
              <div styleName="show-face-btn" ref={(ref) => { this.showFaceBtn = ref; }}>
                <img id="face" src={require('../../images/icon-face.png')} alt="" />
              </div>
            </div>
            <div ref={(ref) => { this.msgInputBox = ref; }} styleName="msg-input-box">
              <MsgInput
                id="input"
                ref={(ref) => { this.msgInput = ref; }}
                focusCallBack={() => this.focusInputCallBack()}
                blurCallBack={() => this.blurInputCallBack()}
                readOnly={!hasChatAuthority}
                placeholder={hasChatAuthority ? '' : '当前不允许发消息'}
              />
            </div>
            <div styleName="send-msg-box" >
              <button onTouchTap={this.sendMsg} disabled={!hasChatAuthority}>发送</button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

