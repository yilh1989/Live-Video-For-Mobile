/**
 * Created by Amg on 2016/10/31.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './chat_record.scss';
import OneRecord from './one_record';
import {
  requestNewChatRecord,
  requestAuditChatRecordID,
  requestMoreChatRecord,
  startScrollRun,
} from '../../../model/chat/action_chat';
import Empty from '../../empty/empty';
import { CLOSE_LOOP, STATUS } from '../../../server/define';

// 导入所有喝彩图片
const cheerImg = ['dyg', 'zyg', 'zs', 'xh'];
cheerImg.forEach(img => require(`../../../images/${img}.gif`));

@cssModules(styles, { allowMultiple: true, errorWhenNotFound: true })
export default class ChatRecord extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    parentAudit: PropTypes.bool,
    isAnalyst: PropTypes.bool,
    allRecord: PropTypes.object,
    requestRecordNewTime: PropTypes.number,
    requestRecordAuditTime: PropTypes.number,
    maxID: PropTypes.number,
    pageIndex: PropTypes.number,
    scrollRunDirect: PropTypes.string,
    noMore: PropTypes.bool,
    viewMoreCallBack: PropTypes.func,
    chatInfoStatus: PropTypes.number,
  };

  componentDidMount() {
    this.chatContent.addEventListener('scroll', this.handleScroll);
    if (this.props.requestRecordNewTime !== CLOSE_LOOP) this.loopGetNewRecord();
    if (this.props.requestRecordAuditTime !== CLOSE_LOOP) this.loopGetAuditRecord();
  }

  componentDidUpdate() {
    const { dispatch, scrollRunDirect } = this.props;
    if (scrollRunDirect !== null) {
      this.scrollRunToDirect(scrollRunDirect);
      dispatch(startScrollRun());
    }
  }

  componentWillUnmount() {
    this.chatContent.removeEventListener('scroll', this.handleScroll);
    if (this.loopTimeGetNew) clearInterval(this.loopTimeGetNew);
    if (this.loopTimeGetAudit) clearInterval(this.loopTimeGetAudit);
  }

  getMoreRecord = () => {
    const { dispatch, noMore } = this.props;
    if (!noMore) dispatch(requestMoreChatRecord(this.props.pageIndex));
  };

  // 定时查询新记录
  loopGetNewRecord = () => {
    if (this.loopTimeGetNew) clearInterval(this.loopTimeGetNew);
    this.loopTimeGetNew = setInterval(() => {
      this.props.dispatch(requestNewChatRecord(this.props.maxID));
    }, this.props.requestRecordNewTime * 1000);
  };

  // 定时查询审核记录
  loopGetAuditRecord = () => {
    if (this.loopTimeGetAudit) clearInterval(this.loopTimeGetAudit);
    this.loopTimeGetAudit = setInterval(() => {
      this.props.dispatch(requestAuditChatRecordID(this.props.pageIndex));
    }, this.props.requestRecordAuditTime * 1000);
  };

  // 滚动
  scrollRunToDirect = (scrollRunDirect) => {
    let direct = 0;
    if (scrollRunDirect === 'bottom') direct = this.chatContent.scrollHeight;
    setTimeout(() => { this.chatContent.scrollTop = direct; }, 100); // TODO: 这个定时器有必要？思考
  };

  renderRecord = () => {
    const {
      dispatch,
      allRecord,
      parentAudit,
      isAnalyst,
      viewMoreCallBack,
      chatInfoStatus,
    } = this.props;
    if (chatInfoStatus === STATUS.fetching) {
      return <Empty content="正在加载···" />;
    }
    if (chatInfoStatus === STATUS.fail ||
      (chatInfoStatus === STATUS.success && allRecord.length === 0)) {
      return <Empty content="您来的太早了，暂时还没有直播内容" />;
    }
    const allRecordID = Object.keys(allRecord).sort((a, b) => a - b);
    return allRecordID.map(key =>
      < OneRecord
        key={key}
        dispatch={dispatch}
        parentAudit={parentAudit}
        isAnalyst={isAnalyst}
        oneRecordData={allRecord[key]}
        viewMoreCallBack={viewMoreCallBack}
      />);
  };

  renderPrompt = () => {
    if (this.props.chatInfoStatus === STATUS.fetching) {
      return null;
    }
    if (this.props.noMore) {
      return (<div styleName="no-more">
        ————&nbsp;&nbsp;&nbsp;没有更多聊天记录&nbsp;&nbsp;&nbsp;————
      </div>);
    }
    return <div styleName="more" onTouchTap={this.getMoreRecord}><b />查看更多消息</div>;
  };

  render() {
    return (
      <div styleName="record-box">
        <div
          ref={(ref) => { this.chatContent = ref; }}
          styleName="chat-content"
        >

          { this.renderPrompt() }
          { this.renderRecord() }

        </div>

      </div>
    );
  }
}
