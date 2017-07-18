/**
 * Created by Amg on 2016/11/11.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './one_calendar.scss';
import { dateFormat } from '../../ultils/tools';

const getStarsNum = (level) => {
  const importanceArr = {
    低: 1,
    中: 2,
    高: 3,
  };
  return importanceArr[level];
};

class OneCalendar extends Component {
  static propTypes = {
    oneCalendarData: PropTypes.object.isRequired,
  };

  renderStars = (level, NewID) => {
    const starsNum = getStarsNum(level);
    const starsArr = [1, 2, 3];
    return starsArr.map((i) => (
      <img
        key={`${NewID}-${i}`}
        src={require(`../../images/banner/star${i <= starsNum ? 'High' : 'Gray'}.png`)}
        alt="level"
      />
    ));
  };

  render() {
    const {
      NewTime,
      NewID,
      Country,
      Importance: level,
      Content,
      LastValue,
      PredictValue,
      PublishValue,
      Influence,
    } = this.props.oneCalendarData;
    const time = dateFormat(NewTime, 'HH:mm');
    const countryCode = parseInt(Country.substr(-2, 2), 10);
    const countryImg = (countryCode < 2 || countryCode > 22) ? 'default' : Country;
    return (
      <div styleName="one-calendar">
        <div styleName="createTime">{ time }</div>
        <div styleName="main">
          <div styleName="left">
            <div styleName="country">
              <img
                src={require(`../../images/banner/${countryImg}.png`)}
                onError={(e) => {
                  const el = e.target;
                  el.src = require('../../images/banner/default.png');
                }}
                alt=""
              />
            </div>
            <div styleName="star">
              { this.renderStars(level, NewID) }
            </div>
          </div>
          <div styleName="right">
            <div styleName="content">{Content}</div>
            <div styleName="info">
              <div>
                <div styleName="item">前值：{LastValue}</div>
                <div styleName="item">预期：{PredictValue}</div>
              </div>
              <div>
                <div styleName="item">实际：{PublishValue}</div>
                <div styleName="item">{Influence}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default cssModules(OneCalendar, styles, { allowMultiple: true, errorWhenNotFound: false });
