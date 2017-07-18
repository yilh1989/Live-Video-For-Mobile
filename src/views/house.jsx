/**
 * Created by dell on 2016/11/24.
 */
import 'fetch-ie8';

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './house.scss';
import Tips from '../component/tips/tips';
import { toGetRoomInfo } from '../model/action';

@cssModules(styles, { allowMultiple: true, errorWhenNotFound: false })
export default class House extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isGetAllRooms: PropTypes.bool.isRequired,
    isGetRoomsStatus: PropTypes.bool.isRequired,
    isGetAuthority: PropTypes.bool.isRequired,
    startRender: PropTypes.number,
    allRooms: PropTypes.array,
    authority: PropTypes.object,
    roomsPlayingInfo: PropTypes.object,
  };

  intoOneRoom = (room) => {
    const { isGetAllRooms, isGetAuthority } = this.props;
    if (!isGetAllRooms || !isGetAuthority) {
      Tips.show('抱歉，房间正在加载中！');
    } else if (this.props.authority.isRoomAccessable(room.roomname, room.roomid)) {
      // 修改这里！！！？？？
      this.props.dispatch(toGetRoomInfo(parseInt(room.roomid, 10)));
    } else {
      Tips.show('抱歉，您没有访问该房间的权限！');
    }
  };

  renderRoomList = () => {
    const { allRooms, isGetRoomsStatus, roomsPlayingInfo } = this.props;
    if (this.props.allRooms.length === 0) {
      return <div styleName="no-rooms"><b>请稍后访问</b></div>;
    }
    return (
      <ul styleName="all-room-list">
        {
          allRooms.map((item, idx) => {
            let isPlaying = false;
            let playingStatusFlag;
            const roomStatusInfo = roomsPlayingInfo[item.roomid];
            const playingStatus = roomStatusInfo ? roomStatusInfo.isPlaying : false;

            if (!isGetRoomsStatus) {
              playingStatusFlag = <div styleName="off-play getting-play">加载直播状态中</div>;
            } else if (!item.isYYPlayer && playingStatus) {
              // TODO: YY直播默认暂无直播，后期需开启时，同时开启video.jsx中yy直播
              isPlaying = true;
              playingStatusFlag = <div styleName="on-play">正在直播</div>;
            } else {
              playingStatusFlag = <div styleName="off-play">暂无直播</div>;
            }

            return (
              <li
                key={`roomId-${item.roomid}-idx-${idx}`}
                styleName="one-room"
                onTouchTap={() => { this.intoOneRoom(item); }}
              >
                <div styleName={`logo bg-color-${idx + 1} ${isPlaying ? '' : 'bg-color-gray'}`}>
                  <b />
                </div>
                <div styleName="room-name">
                  <div styleName="name">{item.roomname}</div>
                  {playingStatusFlag}
                </div>
                <div styleName="into-room-icon" />
              </li>
            );
          })
        }
      </ul>
    );
  };

  render() {
    return (
      <div styleName="choose-room">
        {this.renderRoomList()}
      </div>
    );
  }
}

