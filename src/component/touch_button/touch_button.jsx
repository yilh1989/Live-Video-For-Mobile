/**
 * Created by dell on 2016/11/30.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './touch_button.scss';

class TouchButton extends Component {
  static defaultProps = {
    canMove: true,
    startDirectionX: 'left',
    startDirectionY: 'top',
    startOffsetX: 0,
    startOffsetY: window.innerHeight / 2,
    buttonText: '返回',
  };

  static propTypes = {
    canMove: PropTypes.bool,
    buttonText: PropTypes.string,
    startDirectionX: PropTypes.string,
    startDirectionY: PropTypes.string,
    startOffsetX: PropTypes.number,
    startOffsetY: PropTypes.number,
    limitDirectionX: PropTypes.bool,
    startCallBackFunc: PropTypes.func,
    moveCallBackFunc: PropTypes.func,
    endCallBackFunc: PropTypes.func,
    clickCallBack: PropTypes.func,
    buttonStyle: PropTypes.string,
  };

  componentDidMount() {
    const {
      startDirectionX: x, startOffsetX: numX, startDirectionY: y, startOffsetY: numY,
    } = this.props;
    const style = `${x}:${numX}px;${y}:${numY}px`;
    this.buttonBox.setAttribute('style', style);
    if (this.props.buttonStyle) this.button.setAttribute('style', this.props.buttonStyle);
    if (this.props.canMove) {
      this.buttonBox.addEventListener('touchstart', (e) => this.touchStart(e));
      this.buttonBox.addEventListener('touchmove', (e) => this.touchMove(e));
      this.buttonBox.addEventListener('touchend', (e) => this.touchEnd(e));
    }
  }

  componentWillUnmount() {
    this.buttonBox.removeEventListener('touchstart', (e) => this.touchStart(e));
    this.buttonBox.removeEventListener('touchmove', (e) => this.touchMove(e));
    this.buttonBox.removeEventListener('touchend', (e) => this.touchEnd(e));
  }

  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  directionX = this.props.startDirectionX;
  directionY = this.props.startDirectionY;
  offsetX = this.props.startOffsetX;
  offsetY = this.props.startOffsetY;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;

  touchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    this.startX = parseInt(touch.pageX, 10);
    this.startY = parseInt(touch.pageY, 10);

    if (this.props.startCallBackFunc) this.props.startCallBackFunc();
  };

  touchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    const mX = parseInt(touch.pageX, 10) - this.startX;
    const mY = parseInt(touch.pageY, 10) - this.startY;
    this.moveX = this.directionX === 'left' ? mX : -mX;
    this.moveY = this.directionY === 'top' ? mY : -mY;

    const [x, y] = [this.directionX, this.directionY];
    const numX = [
      0,
      this.moveX + this.offsetX,
      this.windowWidth - this.buttonBox.clientWidth,
    ].sort((a, b) => a - b)[1];
    const numY = [
      0,
      this.moveY + this.offsetY,
      this.windowHeight - this.buttonBox.clientHeight,
    ].sort((a, b) => a - b)[1];

    const style = `${x}:${numX}px;${y}:${numY}px`;
    this.buttonBox.setAttribute('style', style);

    if (this.props.moveCallBackFunc) this.props.moveCallBackFunc();
  };

  touchEnd = (e) => {
    e.preventDefault();

    // 仅处理左右方向，不处理上下方向
    if (!this.props.limitDirectionX) {
      if ((2 * this.moveX) + this.buttonBox.clientWidth > this.windowWidth) {
        if (this.directionX === 'right') {
          this.directionX = 'left';
        } else if (this.directionX === 'left') {
          this.directionX = 'right';
        }
      }
    }
    const [x, y] = [this.directionX, this.directionY];
    const numX = this.offsetX = 0;
    const numY = this.offsetY = [
      0,
      this.moveY + this.offsetY,
      this.windowHeight - this.buttonBox.clientHeight,
    ].sort((a, b) => a - b)[1];
    const style = `${x}:${numX}px;${y}:${numY}px`;
    this.buttonBox.setAttribute('style', style);

    if (this.props.endCallBackFunc) this.props.endCallBackFunc();
  };

  clickFunc = () => {
    if (this.props.clickCallBack) this.props.clickCallBack();
  };

  render() {
    return (
      <div
        styleName="button-box"
        ref={(ref) => { this.buttonBox = ref; }}
        onTouchTap={this.clickFunc}
      >
        <div styleName="button" ref={(ref) => { this.button = ref; }}>{this.props.buttonText}</div>
      </div>
    );
  }
}

export default cssModules(TouchButton, styles, { allowMultiple: true, errorWhenNotFound: false });
