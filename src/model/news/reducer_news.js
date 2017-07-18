/**
 * Created by Amg on 2016/11/1.
 */

import { STATUS } from '../../server/define';

import * as ActionTypes from './action_types_news';

const initNewsState = {
  status: STATUS.fetching,
  data: {
    NewList: [],
  },
};

export default function newsInfo(state = initNewsState, action) {
  switch (action.type) {
    case ActionTypes.SUCCESS_GET_NEWS:
      return {
        ...state,
        data: {
          ...state.data,
          NewList: [...state.data.NewList, ...action.data.NewList],
        },
        status: STATUS.success,
      };
    case ActionTypes.FAILED_GET_NEWS:
      return { ...state, status: STATUS.fail };
    default:
      return state;
  }
}

