/**
 * Created by Amg on 2016/11/1.
 */

import { STATUS } from '../../server/define';

import * as ActionTypes from './action_types_strategy';


const initStrategyState = {
  status: STATUS.fetching,
};

export default function strategyInfo(state = initStrategyState, action) {
  switch (action.type) {
    case ActionTypes.SUCCESS_GET_REALTIME:
      return { ...state, data: action.data, status: STATUS.success };
    case ActionTypes.FAILED_GET_REALTIME:
      return { ...state, status: STATUS.fail };
    default:
      return state;
  }
}

