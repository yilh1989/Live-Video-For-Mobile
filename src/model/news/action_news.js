/**
 * Created by Amg on 2016/11/1.
 */
import * as ActionTypes from './action_types_news';
import ConsultingApi from '../../server/api/consulting_api';

// 7X24小时要闻
function successGetNews(json) {
  return {
    type: ActionTypes.SUCCESS_GET_NEWS,
    data: json.Data,
  };
}

function failedGetNews() {
  return {
    type: ActionTypes.FAILED_GET_NEWS,
  };
}

export default function getNews(obj) {
  return function wrap(dispatch) {
    return ConsultingApi.getAllTimeNews(obj)
      .then(json => dispatch(successGetNews(json)))
      .catch(() => dispatch(failedGetNews()));
  };
}
