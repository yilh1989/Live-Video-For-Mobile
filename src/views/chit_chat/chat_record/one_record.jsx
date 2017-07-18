/**
 * Created by Amg on 2016/10/31.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { requestAuditMsg } from '../../../model/chat/action_chat';
import styles from './one_record.scss';

class OneRecord extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    parentAudit: PropTypes.bool,
    isAnalyst: PropTypes.bool,
    oneRecordData: PropTypes.object,
    viewMoreCallBack: PropTypes.func,
  };

  isShow = (parentAudit, isAudit, isAnalyst) => {
    if (!parentAudit || !isAudit) return true; // 不需要审核时
    if (isAnalyst) return true; // 有权限时
    return false;
  };

  // 占位符转换图片
  formatFaceImg = (content) => {
    let msg = '';
    if (content) {
      msg = content.replace(/\[em_([0-9]*)\]/g, ($1) => { // eslint-disable-line no-useless-escape
        const num = $1.split('_')[1].split(']')[0];
        return `<img 
          draggable="false" 
          class="face-img"
          src="${require(`../../../images/face/${num}.ico`)}" data-name="em_${num}" 
        />`.trim();
      });
    }
    return msg;
  };

  // 格式化聊天内容
  formatMsg = (msgData) => ({
    ...msgData,
    content: this.formatFaceImg(decodeURIComponent(msgData.content)),
  });

  auditMsg = (recordID) => () => {
    this.props.dispatch(requestAuditMsg(recordID));
  };

  clickContent = (e) => {
    const el = e.target;
    if (el.className === 'showCelueDetail') {
      this.props.viewMoreCallBack();
    }
  };

  render() {
    const { parentAudit, oneRecordData, isAnalyst } = this.props;
    const {
      isAudit,
      groupimg: groupImg,
      custname: chatName,
      createtime: createTime,
      content,
      id: recordID,
    } = this.formatMsg(oneRecordData);
    const isShow = this.isShow(parentAudit, isAudit, isAnalyst);
    return (
      isShow ?
        <div styleName="box">
          <div>
            <div styleName="left">
              <img
                alt="gimg"
                src={groupImg}
              />
            </div>
            <div styleName="right">
              <div styleName="record-header">
                <span styleName="chat-name">{chatName}</span>
                <span styleName="create-time">{createTime}</span>
              </div>
              <div
                onTouchTap={(e) => this.clickContent(e)}
                styleName="record-content"
                dangerouslySetInnerHTML={{ __html: (content) }}
              />
              <div styleName="record-footer">
                {isAudit && isAnalyst ?
                  <span
                    styleName="audit"
                    onTouchTap={this.auditMsg(recordID)}
                  >审核
              </span>
                  : ''
                }
              </div>
            </div>
          </div>
        </div>
        :
        <div />
    );
  }
}

export default cssModules(OneRecord, styles, { allowMultiple: true, errorWhenNotFound: false });
