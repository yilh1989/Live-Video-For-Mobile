/**
 * Created by Amg on 2016/11/1.
 */
import * as ActionTypes from './action_types_cal';
import ConsultingApi from '../../server/api/consulting_api';

// 财经日历
function successCalendar(json, date) {
  return {
    type: ActionTypes.SUCCESS_GET_CALENDAR,
    data: json.data,
    date,
  };
}

function failedCalendar() {
  return {
    type: ActionTypes.FAILED_GET_CALENDAR,
  };
}

export default function getCalendar(obj) {
  return function wrap(dispatch) {
    return ConsultingApi.getAllCalendar(obj)
      .then(json => {
        console.log('json', json);
        dispatch(successCalendar(json, obj.Date));
      })
      .catch((e) => {
        console.log('e', e);
        dispatch(failedCalendar());
      });
  };
}
