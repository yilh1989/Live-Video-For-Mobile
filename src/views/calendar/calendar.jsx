/**
 * Created by dell on 2016/11/1.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './calendar.scss';
import getCalendar from '../../model/calendar/action_cal';
import { dateFormat, Dates } from '../../ultils/tools';
import OneCalendar from './one_calendar';
import { STATUS } from '../../server/define';
import Empty from '../empty/empty';

class Calendar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    calendarInfo: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      date: this.props.calendarInfo.date,
    };
  }

  weekDayArray = () => {
    const weekType = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const weekDay = Dates.getThisWeekStartMondayArray('yyyy-MM-dd', weekType);
    const weekDayReturn = [];
    weekDay.forEach((day, index) => {
      weekDayReturn[index] = { ...day, showDate: dateFormat(day.date, 'MM/dd') };
    });
    return weekDayReturn;
  };

  showDay = (date) => () => {
    this.setState({ date });
    this.props.dispatch(getCalendar({ Date: date }));
  };

  renderWeekDay = () => (
    this.weekDayArray().map((day) =>
      <div styleName={`week ${this.state.date === day.date ? 'week-active' : ''}`} key={day.date}>
        <div styleName="day" onTouchTap={this.showDay(day.date)}>
          <div>{day.week}</div>
          <div>{day.showDate}</div>
        </div>
      </div>
    )
  );

  renderCalendar = () => {
    const { data: calendarData, calendarStatus } = this.props.calendarInfo;
    if (calendarStatus === STATUS.fetching) {
      return <Empty content="正在加载..." />;
    }
    if (calendarStatus === STATUS.fail || (calendarData && calendarData.length) === 0) {
      return <Empty content="您来的太早了，今日暂无财经数据" />;
    }
    return (
      calendarData.map((oneCalendarData) =>
        <OneCalendar key={oneCalendarData.NewID} oneCalendarData={oneCalendarData} />)
    );
  };

  render() {
    return (
      <div styleName="calendar">
        <div styleName="date">
          { this.renderWeekDay() }
        </div>
        <div styleName="content" ref={(ref) => { this.content = ref; }}>
          { this.renderCalendar() }
        </div>
      </div>
    );
  }
}

export default cssModules(Calendar, styles, { allowMultiple: true, errorWhenNotFound: false });
