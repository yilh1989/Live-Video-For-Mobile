/**
 * Created by Amg on 2016/11/2.
 */

import sha1 from 'sha1';
import { commonCMD, wrapWithRoomID, postBI, postC } from '../helper';

// 咨询相关一些api TODO: '这里比较乱，有几个接口还是.net的'
export default class ConsultingApi {

  // 获得消息中心配置参数 md: 01 fc: 023
  static getMessageCenterConfig() {
    return postBI(
      commonCMD({ fc: '023' }),
      ConsultingApi.getMessageCenterConfig.name
    );
  }

  // 获取7x24小时要闻
  static getAllTimeNews(obj) {
    const initdate = {
      Function: 101,
      PageSize: 20,
      Market: NewsMarket,
      Code: NewsCode,
      TreeID: NewsTreeID,
      CategoryCode: NewsCategoryCode,
      OrgCode: NewsOrgCode,
      WebCode: NewsWebCode,
      PageIndex: 1,
      LastNewID: 0,
      Desc: 0,
    };
    const requiredate = { ...initdate, ...obj, OrgCode: sha1(`${obj.OrgCode}`).toUpperCase() };
    return postC(NEWS_URL, requiredate, 'getAllTimeNews');
  }

  // 获取财经日历
  static getAllCalendar(obj) {
    const initdate = {
      Function: 100,
      Date: '',  //（'YYYY-MM-DD'）
    };
    const requiredate = { ...initdate, ...obj };
    return postC(CALENDAR_URL, requiredate, 'getAllCalendar');
  }

  // 获得即时策略 md: 04, fc: 011
  static getAllStrategy(pindex = 1, pagesize = 6) {
    return postBI(
      wrapWithRoomID({ fc: '011', pindex, pagesize }),
      ConsultingApi.getAllStrategy.name
    );
  }
}
