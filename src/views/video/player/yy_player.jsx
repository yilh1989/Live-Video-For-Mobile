/**
 * Created by dz on 16/10/10.
 */
/* eslint react/no-danger:off */
import React, { PropTypes } from 'react';

const openYYPlayer = false; // TODO: 移动端关闭YY处理

function getYYPlayer() {
  const src = `http://hls.yy.com/newlive/54880976_54880976.m3u8?
    org=yyweb
    &appid=0
    &uuid=c03ac9aef1064eef8d42fa681ef929e4
    &t=1480986069&tk=e95f3daa9b3c0181789bcdf256eaf0e7
    &uid=0&ex_audio=0
    &ex_coderate=1200
    &ex_spkuid=0`.trim();
  return (`<video 
    width="100%" 
    height="100%"  
    id="player" 
    preload 
    controls 
    webkit-playsinline 
    playsinline 
    src=${src}
  ></video>`.trim());
}

const YYPlayer = props => (
  openYYPlayer ?
    <div
      style={{ width: '100%', height: '100%' }}
      dangerouslySetInnerHTML={{ __html: getYYPlayer(props.topSid, props.subSid) }}
    /> : null
);

YYPlayer.propTypes = {
  topSid: PropTypes.string,
  subSid: PropTypes.string,
};

export default YYPlayer;

