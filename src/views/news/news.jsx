/**
 * Created by dell on 2016/11/1.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './news.scss';
import getNews from '../../model/news/action_news';
import { STATUS } from '../../server/define';
import Empty from '../empty/empty';
import OneNews from './one_news';

class News extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    appInfo: PropTypes.object,
    newsInfo: PropTypes.object,
  };
  pageIndex = 1;
  handleScroll = () => {
    const me = this.rowScroll;
    let newId = null;
    if (me.clientHeight + me.scrollTop >= me.scrollHeight) {
      newId = this.NewID.props.item.NewID;
      if (!newId) {
        return;
      }
      const { orgcode, platform } = this.props.appInfo;
      this.props.dispatch(getNews({
        OrgCode: orgcode,
        WebCode: platform,
        PageIndex: ++this.pageIndex,
        LastNewID: newId,
        Desc: 1,
      }));
      console.log(this.pageIndex);
    }
  };

  time(createTime) {
    const date = new Date(createTime);
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const mini = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const t = { month, day, hour, mini };
    return t;
  }

  render() {
    const { data, status } = this.props.newsInfo;
    if (status === STATUS.fetching) {
      return <Empty content="正在加载···" />;
    }
    if (status === STATUS.fail ||
      (data.NewList && data.NewList.length === 0 && this.pageIndex === 1)) {
      return <Empty content="您来的太早了，今日暂无7X24小时要闻" />;
    }
    return (
      <div styleName="rows" ref={(ref) => { this.rowScroll = ref; }} onScroll={this.handleScroll}>
        {
          data.NewList.map((item) =>
            <OneNews
              item={item}
              time={this.time(item.CreateTime)}
              key={`NewID${item.NewID}`}
              ref={(ref) => { this.NewID = ref; }}
            />
          )
        }
      </div>
    );
  }
}
export default cssModules(News, styles, { allowMultiple: true, errorWhenNotFound: false });
