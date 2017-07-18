/**
 * Created by Amg on 2016/11/1.
 */

import { STATUS } from '../../server/define';
import * as ActionTypes from './action_types_cal';
import { Dates } from '../../ultils/tools';

const initCalendarState = {
  data: [],
  date: Dates.getNow('yyyy-MM-dd'),
  calendarStatus: STATUS.fetching,
};

export default function calendarInfo(state = initCalendarState, action) {
  switch (action.type) {
    case ActionTypes.SUCCESS_GET_CALENDAR:
      return { ...state, data: action.data, calendarStatus: STATUS.success, date: action.date };
    case ActionTypes.FAILED_GET_CALENDAR:
      return { ...state, calendarStatus: STATUS.fail };
    default:
      return state;
  }
}

