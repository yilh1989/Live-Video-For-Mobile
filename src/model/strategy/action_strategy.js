/**
 * Created by Amg on 2016/11/1.
 */
import * as ActionTypes from './action_types_strategy';
import ConsultingApi from '../../server/api/consulting_api';

// 即时策略
function successGetStrategy(json) {
  return {
    type: ActionTypes.SUCCESS_GET_REALTIME,
    data: json.data,
  };
}

function failedGetStrategy() {
  return {
    type: ActionTypes.FAILED_GET_REALTIME,
  };
}

export default function getStrategy(obj) {
  return function wrap(dispatch) {
    return ConsultingApi.getAllStrategy(obj)
      .then(json => dispatch(successGetStrategy(json)))
      .catch(() => dispatch(failedGetStrategy()));
  };
}
