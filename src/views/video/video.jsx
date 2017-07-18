/**
 * Created by Amg on 2016/11/30.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './video.scss';
import GenseePlayer from './player/gensee_player';
import YYPlayer from './player/yy_player';

const Video = props => {
  const { isGetVideoInfo, roomsPlayingInfo, roomID, isYYPlayer, site, authcode, videoURL } = props;
  const renderPlayer = () => {
    if (!isGetVideoInfo) {
      return (
        <div styleName="video-prompt">
          <span styleName="txt"><b styleName="icon-fetch" />正在获取直播视频...</span>
        </div>);
    }
    if (isYYPlayer || !roomsPlayingInfo[roomID] || !roomsPlayingInfo[roomID].isPlaying) {
      return (
        <div styleName="video-prompt">
          <span styleName="txt"><b styleName="icon-no" />当前暂无直播</span>
        </div>);
    }
    // TODO: YY直播默认暂无直播，后期需开启时，同时开启house.jsx中直播状态
    if (isYYPlayer) return <YYPlayer topSid={videoURL} />;
    return <GenseePlayer site={site} authcode={authcode} videoURL={videoURL} />;
  };
  return (
    <div styleName="video">
      { renderPlayer() }
    </div>
  );
};

Video.propTypes = {
  isYYPlayer: PropTypes.bool,
  site: PropTypes.string,
  authcode: PropTypes.string,
  ownerid: PropTypes.string,
  videoURL: PropTypes.string,
  isGetVideoInfo: PropTypes.bool.isRequired,
  roomsPlayingInfo: PropTypes.object.isRequired,
  roomID: PropTypes.number.isRequired,
};

export default cssModules(Video, styles, { allowMultiple: true, errorWhenNotFound: false });
