/**
 * Created by dell on 2016/11/15.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './one_strategy.scss';

const directionLabel = {
  0: { key: 0, color: 'black', label: '--' },
  1: { key: 1, color: 'red', label: '做多' },
  2: { key: 2, color: 'green', label: '做空' },
  3: { key: 3, color: 'blue', label: '查看' },
};

const OneStrategy = (props) => {
  const {
    strategyData: {
      direction = 0,
      variety = '--',
      analyst = '--',
      openprice = '--',
      opentime,
      stopLossprice = '--',
      stopprofitprice = '--',
      profitprice = '--',
      closeprice = '--',
      closetime = '--',
    },
  } = props;
  return (
    <div styleName="one-strategy">
      <div styleName="header">
        <div styleName="item-left">
          <span styleName="goods">{variety}</span>
          <span styleName={`direction-${directionLabel[direction].color}`}>
            {directionLabel[direction].label}
          </span>
        </div>
        <div styleName="analyst item-right">
          <span>分析师：</span>
          <span>{analyst}</span>
        </div>
      </div>
      <div styleName="main">
        <div>
          <div styleName="item-left">
            <span>开仓价：</span>
            <span styleName="font-bold">{openprice}</span>
          </div>
          <div styleName="item-right">
            <span>开仓时间：</span>
            <span>{opentime}</span>
          </div>
        </div>
        <div>
          <div styleName="item-left">
            <span>止损价：</span>
            <span styleName="font-bold">{stopLossprice}</span>
          </div>
          <div styleName="item-right">
            <div>
              <span>止盈价：</span>
              <span styleName="font-bold">{stopprofitprice}</span>
            </div>
            <div>
              <span>盈利点：</span>
              <span styleName="font-bold font-red">{profitprice}</span>
            </div>
          </div>
        </div>
        <div>
          <div styleName="item-left">
            <span>平仓价：</span>
            <span styleName="font-bold">{closeprice}</span>
          </div>
          <div styleName="item-right">
            <span>平仓时间：</span>
            <span>{closetime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
OneStrategy.propTypes = {
  strategyData: PropTypes.object,
};
export default cssModules(OneStrategy, styles, { allowMultiple: true, errorWhenNotFound: false });
