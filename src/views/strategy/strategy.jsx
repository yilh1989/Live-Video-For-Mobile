/**
 * Created by dell on 2016/11/1.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './strategy.scss';
import { STATUS } from '../../server/define';
import Empty from '../empty/empty';
import OneStrategy from './one_strategy';

const Strategy = props => {
  const { data, status } = props.strategyInfo;
  if (status === STATUS.fetching) {
    return <Empty content="正在加载..." />;
  }
  if (status === STATUS.fail || (data && data.length === 0)) {
    return <Empty content="您来的太早了，今日暂无即时策略数据" />;
  }

  return (
    <div styleName="strategy">
      {
        data.map((item) => <OneStrategy key={item.strategyid} strategyData={item} />)
      }
    </div>
  );
};
Strategy.propTypes = {
  strategyInfo: PropTypes.object,
};

export default cssModules(Strategy, styles, { allowMultiple: true, errorWhenNotFound: false });
