/**
 * Created by dell on 2016/11/18.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './one_news.scss';

class OneNews extends Component {
  static propTypes = {
    item: PropTypes.object,
    time: PropTypes.object,
  };

  render() {
    const item = this.props.item;
    const time = this.props.time;
    return (
      <div styleName="one_news">
        <div
          styleName="cell" ref={(ref) => { this.NewID = ref; }}
          id={item.NewID}
        >
          <div styleName="time">
            <div>{time.hour}:{time.mini}</div>
            <div>{time.month}/{time.day}</div>
          </div>
          <div styleName="news">
            <div styleName="circle" />
            <div styleName="new" dangerouslySetInnerHTML={{ __html: item.NewTitle }} />
          </div>
        </div>
      </div>
    );
  }
}

export default cssModules(OneNews, styles, { allowMultiple: true, errorWhenNotFound: false });
