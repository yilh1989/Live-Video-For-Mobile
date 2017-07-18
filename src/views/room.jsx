/**
 * Created by dell on 2016/11/1.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './room.scss';
import Chitchat from './chit_chat/chit_chat';
import { STATUS, NEED_AUDIT, CLOSE_LOOP } from '../server/define';
import Video from './video/video';
import News from './news/news';
import Calendar from './calendar/calendar';
import Strategy from './strategy/strategy';
import Tips from '../component/tips/tips';
import { Dates } from '../ultils/tools';
import AppConfig, { styleConfig } from '../server/app_config';
import Timer from '../ultils/timer';
import TouchButton from '../component/touch_button/touch_button';
import {
  toLogoutApp,
  toRefreshToken,
  exitRoom,
} from '../model/action';
import {
  requestChatRecord, requestNewChatRecord, requestAuditChatRecordID, toKeepOnline, startScrollRun,
} from '../model/chat/action_chat';
import getNews from '../model/news/action_news';
import getStrategy from '../model/strategy/action_strategy';
import getCalendar from '../model/calendar/action_cal';

@cssModules(styles, { allowMultiple: true, errorWhenNotFound: false })
export default class Room extends React.Component {
  static defaultProps = {
    needIntoStrategy: false,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    appInfo: PropTypes.object,
    roomInfo: PropTypes.object,
    chatInfo: PropTypes.object,
    newsInfo: PropTypes.object,
    calendarInfo: PropTypes.object,
    strategyInfo: PropTypes.object,
    needIntoStrategy: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      roomType: '',
    };
  }

  componentWillMount() {
    this.timeChecker();
  }

  componentWillUnmount() {
    this.timer.clear();
    this.timer = null;
  }

  timeChecker() {
    this.timer = new Timer();
    const { dispatch } = this.props;
    if (LOGIN_TIME_OUT_COUNT !== CLOSE_LOOP && !AppConfig.isApp) {
      this.timer.onLoginTimeOut = () => dispatch(toLogoutApp(true));
    }
    this.timer.registerTimer(REFRESH_TOKEN_TIME, () => dispatch(toRefreshToken()));
    this.timer.registerTimer(CHECK_TIME, () => dispatch(toKeepOnline()));
  }

  viewMoreCallBack = () => this.showStrategy();

  isToChat = false;
  isToStrategy = false;

  showChat = () => {
    if (this.state.roomType === 'chat') return;

    this.isToChat = true;

    this.setState({ roomType: 'chat' });
    const { maxID, pageIndex } = this.props.chatInfo;
    this.props.dispatch(startScrollRun('bottom'));
    this.props.dispatch(requestNewChatRecord(maxID));
    this.props.dispatch(requestAuditChatRecordID(pageIndex));
  };

  showNews = () => {
    if (this.state.roomType === 'news') return;

    this.setState({ roomType: 'news' });
    const data = this.props.newsInfo.data;
    if (data && data.NewList.length !== 0) return;
    const { orgcode, platform } = this.props.appInfo;
    if (this.props.newsInfo.status === STATUS.fetching) {
      this.props.dispatch(getNews({
        OrgCode: orgcode,
        WebCode: platform,
      }));
    }
  };

  showCalendar = () => {
    if (this.state.roomType === 'calendar') return;

    this.setState({ roomType: 'calendar' });
    const data = this.props.calendarInfo.data;
    if (data && data.length !== 0) return;
    const date = Dates.getNow('yyyy-MM-dd');
    this.props.dispatch(getCalendar({
      Date: date,
    }));
  };

  showStrategy = () => {
    if (this.state.roomType === 'strategy') return;

    this.isToStrategy = true;

    if (!this.props.appInfo.authority.isStrategyViewEnable()) {
      Tips.show('您没有查看即时策略的权限！', this.content);
    } else {
      this.isToChat = true;
      this.setState({ roomType: 'strategy' });
      if (this.props.strategyInfo.status === STATUS.fetching) {
        this.props.dispatch(getStrategy());
      }
    }
  };

  toExitRoom = () => {
    this.props.dispatch(exitRoom());
  };

  renderNav = () => {
    const navType = [
      { key: 'chat', label: '视频直播', clickFunc: 'showChat' },
      { key: 'news', label: '7X24小时要闻', clickFunc: 'showNews' },
      { key: 'calendar', label: '财经日历', clickFunc: 'showCalendar' },
      { key: 'strategy', label: '即时策略', clickFunc: 'showStrategy' },
    ];
    return navType.map((item) => (
      <span
        key={item.key}
        styleName={
          `nav-item nav-item-${item.key} ${this.state.roomType === item.key ? 'active' : ''}`
        }
        onTouchTap={this[item.clickFunc]}
      >
        {item.label}
      </span>
    ));
  };

  renderContent = () => {
    const {
      dispatch, roomInfo, chatInfo, appInfo, newsInfo, calendarInfo, strategyInfo,
    } = this.props;
    const parentAudit = roomInfo.isaudit === NEED_AUDIT;
    const isAnalyst = appInfo.user.isAnalyst;
    const room = {
      chat: <Chitchat
        dispatch={dispatch}
        parentAudit={parentAudit}
        isAnalyst={isAnalyst}
        appInfo={appInfo}
        roomInfo={roomInfo}
        chatInfo={chatInfo}
        viewMoreCallBack={this.viewMoreCallBack}
      />,
      news: <News
        dispatch={dispatch}
        appInfo={appInfo}
        newsInfo={newsInfo}
      />,
      calendar: <Calendar
        dispatch={dispatch}
        calendarInfo={calendarInfo}
      />,
      strategy: <Strategy
        dispatch={dispatch}
        strategyInfo={strategyInfo}
      />,
    };
    return room[this.state.roomType];
  };

  render() {
    const {
      needIntoStrategy,
      roomInfo: { isGetRoomInfo, isYYPlayer, site, authcode, videoURL, roomID },
      appInfo: { isGetRoomsStatus, roomsPlayingInfo, isGetAuthority },
    } = this.props;

    // 从即时策略进来，直接进入即时策略
    if (needIntoStrategy && !this.isToStrategy && isGetAuthority) this.showStrategy();

    if (!this.isToChat && isGetAuthority) {
      this.props.dispatch(requestChatRecord());
      this.showChat();
    }

    return (
      <div styleName="room">
        <div styleName="video" style={{ height: `${styleConfig.videoHeight}px` }}>
          <Video
            isGetVideoInfo={isGetRoomInfo && isGetRoomsStatus}
            roomsPlayingInfo={roomsPlayingInfo}
            roomID={roomID}
            isYYPlayer={isYYPlayer}
            site={site}
            authcode={authcode}
            videoURL={videoURL}
          />
        </div>
        <div styleName="nav" style={{ height: `${styleConfig.navHeight}px` }}>
          { this.renderNav() }
        </div>
        <div
          styleName="content" ref={(ref) => { this.content = ref; }}
          style={{ height: `${styleConfig.contentHeight}px` }}
        >
          { this.renderContent() }
        </div>
        <div>
          <TouchButton clickCallBack={this.toExitRoom} startDirectionX="right" buttonText="重选房间" />
        </div>
      </div>
    );
  }
}

