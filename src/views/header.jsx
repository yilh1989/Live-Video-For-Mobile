/**
 * Created by dell on 2016/11/1.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './header.scss';
import { toLogoutApp } from '../model/action';
import User from './user';

@cssModules(styles, { allowMultiple: true, errorWhenNotFound: false })
export default class Header extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    displayUserName: PropTypes.string.isRequired,
    isLogin: PropTypes.bool.isRequired,
    roomName: PropTypes.string,
  };

  loginClick = (src) => () => {
    User.show(src);
  };

  logoutClick = () => {
    this.props.dispatch(toLogoutApp());
  };

  loginTable = () => [
    { key: 'reg', label: '注册', src: REG_URL },
    { key: 'login', label: '登录', src: LOGIN_URL },
  ];

  renderLogin = () => this.loginTable().map((item) =>
    (
      <div
        key={item.key}
        styleName={item.key}
        onTouchTap={this.loginClick(item.src)}
      >
        {item.label}
      </div>
    )
  );
  renderLogOut = () => <div styleName="logout" onTouchTap={this.logoutClick}>退出</div>;

  render() {
    const { isLogin, displayUserName, roomName } = this.props;
    return (
      <div
        ref={(ref) => { this.header = ref; }}
        styleName="header"
      >
        <div styleName="room-name">{roomName}</div>
        <div styleName="info">
          <div styleName="name">{displayUserName}</div>
          {
            isLogin ? this.renderLogOut() : this.renderLogin()
          }
        </div>
      </div>
    );
  }
}
