/**
 * Created by Amg on 2016/11/7.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './qq_service.scss';

class QQService extends Component {
  static propTypes = {
    qqInfo: PropTypes.object,
  };
  qqClick = () => {
    const url = `http://wpa.qq.com/msgrd?v=3&uin=${this.props.qqInfo.value}&site=qq&menu=yes`;
    window.location.href = url;
  };

  render() {
    return (
      <li
        styleName="qq-service"
        onTouchTap={this.qqClick}
      >
        {this.props.qqInfo.name}
      </li>
    );
  }
}

export default cssModules(QQService, styles, { allowMultiple: true, errorWhenNotFound: false });
