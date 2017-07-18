/**
 * Created by Amg on 2016/11/17.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cssModules from 'react-css-modules';
import styles from './mainBox.scss';
import Header from './header';
import Room from './room';
import House from './house';
import { appStart, toGetRoomInfo } from '../model/action';
import AppConfig, { styleConfig } from '../server/app_config';
import { NONE, STATUS } from '../server/define';

@cssModules(styles, { allowMultiple: true, errorWhenNotFound: false })
class MainBox extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    appInfo: PropTypes.object,
    roomInfo: PropTypes.object,
    chatInfo: PropTypes.object,
    newsInfo: PropTypes.object,
    calendarInfo: PropTypes.object,
    strategyInfo: PropTypes.object,
  };

  constructor(props) {
    super(props);
    props.dispatch(appStart());
  }

  shouldComponentUpdate(nextProps) {
    const willStartRenderStatus = nextProps.appInfo.startRender;
    if (willStartRenderStatus === STATUS.start) return true;
    return willStartRenderStatus !== STATUS.fetching;
  }

  isRequestToGetRoomInfo = false;

  renderRoomBox = () => {
    const {
      dispatch, appInfo, roomInfo, chatInfo, newsInfo, calendarInfo, strategyInfo,
    } = this.props;
    const roomProps = {
      dispatch, appInfo, roomInfo, chatInfo, newsInfo, calendarInfo, strategyInfo,
    };

    const haveSelectedRoom = roomInfo.roomID !== NONE;

    if (!this.isRequestToGetRoomInfo && appInfo.isGetAllRooms && !roomInfo.isGetRoomInfo) {
      this.isRequestToGetRoomInfo = true;
      if (haveSelectedRoom) {
        dispatch(toGetRoomInfo(roomInfo.roomID));
      } else if (AppConfig.isIntoStrategy) {
        dispatch(toGetRoomInfo(appInfo.allRooms[0].roomid));
      } else {
        this.isRequestToGetRoomInfo = false;
      }
    }

    // 从即时策略进入,首次进入主页面-->直接进入房间
    if (AppConfig.isIntoStrategy && roomInfo.isFirst) {
      return (<Room {...roomProps} needIntoStrategy />);
    }

    // 从视频直播进来,有roomID -->直接进入房间
    if (haveSelectedRoom) {
      return (<Room {...roomProps} />);
    }

    // 其他情况,展示房间选择
    return (<House
      dispatch={dispatch}
      startRender={appInfo.startRender}
      isGetAllRooms={appInfo.isGetAllRooms}
      allRooms={appInfo.allRooms}
      isGetRoomsStatus={appInfo.isGetRoomsStatus}
      roomsPlayingInfo={appInfo.roomsPlayingInfo}
      isGetAuthority={appInfo.isGetAuthority}
      authority={appInfo.authority}
    />);

    // 只有1个房间，直接进入房间 TODO：暂时关闭此功能
    // const len = roomInfo.allRooms.length;
    // if (len === 1) {
    //   const roomId = roomInfo.allRooms.pop().roomid;
    //   this.props.dispatch(toGetRoomInfo(roomId));
    // }
  };

  render() {
    // const startRender = this.props.appInfo.startRender;
    // if (startRender === STATUS.fetching) {
    //   // return null;
    //   return (<Empty
    //     ref={(ref) => { this.empty = ref; }}
    //     content="正在加载..."
    //     style={this.loadingStyle}
    //   />);
    // }
    // if (startRender === STATUS.fail) {
    //   return (<Empty
    //     content="加载失败..."
    //     style={this.loadingStyle}
    //   />);
    // }
    const { dispatch, appInfo, roomInfo } = this.props;
    return (
      <div id="mainBox" styleName="main-box">
        {
          AppConfig.isApp ||
          <div
            id="headerBox"
            styleName="header-box"
            style={{ height: `${styleConfig.headerHeight}px` }}
          >
            <Header
              dispatch={dispatch}
              isLogin={appInfo.isLogin}
              displayUserName={appInfo.displayUserName}
              roomName={roomInfo.roomName}
            />
          </div>
        }
        <div styleName="content-box" id="contentBox">
          <div
            style={{ height: `${styleConfig.roomBoxHeight}px` }}
            styleName="room-box"
          >
            {this.renderRoomBox()}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appInfo: state.appInfo,
    roomInfo: state.roomInfo,
    chatInfo: state.chatInfo,
    newsInfo: state.newsInfo,
    calendarInfo: state.calendarInfo,
    strategyInfo: state.strategyInfo,
  };
}
export default connect(mapStateToProps)(MainBox);
