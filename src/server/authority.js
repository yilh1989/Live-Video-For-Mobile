import { Cookie } from '../ultils/tools';
/**
 * Created by kiny on 16/10/16.
 */

// 授权码
// const INVEST_VIEW_CODE = '004';      // 投资宝典浏览权限004
// const STRATEGY_VIEW_CODE = '005';    // 即时策略浏览权限005
// const SCORE_VIEW_CODE = '006';       // 战机回顾浏览权限006
// const COURSE_VIEW_CODE = '007';      // 课程安排浏览权限007
// const INVEST_EDIT_CODE = '49_008';   // 投资宝典编辑权限008
// const STRATEGY_EDIT_CODE = '009';    // 即时策略编辑权限009
// const SCORE_EDIT_CODE = '010';       // 战绩回顾编辑权限010
// const COURSE_EDIT_CODE = '011';      // 课程安排编辑权限011
// const NOTICE_EDIT_CODE = '012';      // 最新通告编辑权限012
// const ROBOT_CODE = '013';            // 机器人发言013
// const CHAT_REVIEW_CODE = '015';      // 聊天审核015

const EDIT_CODE = '002';
const VIEW_CODE = '001';

export default class Authority {
  currCheckFunID = -1; // 当前检查的功能ID

  constructor(d = null, userGroupType) {
    this.data = d;
    this.userViewable = userGroupType === 2;
  }

  loopCheck(name, code, roomID = parseInt(Cookie.getCookie('roomID') || 0, 10)) {
    if (code === VIEW_CODE && this.userViewable) return true;

    if (!roomID) return false;
    if (this.data === null) return false;

    if (name === '机器人马甲') {
      for (let i = 0, len = this.data.length; i < len; i += 1) {
        const item = this.data[i];
        if (item.bindObjName === name) {
          if (item.funcode === code) {
            this.currCheckFunID = item.funid;
            return item.hasfun === 1;
          }
        }
      }
    } else {
      for (let i = 0, len = this.data.length; i < len; i += 1) {
        const item = this.data[i];
        if (item.bindObjId === roomID) {
          if (item.bindObjName === name) {
            if (item.funcode === code) {
              this.currCheckFunID = item.funid;
              return item.hasfun === 1;
            }
          }
        }
      }
    }

    this.currCheckFunID = -1;
    return false;
  }

  isNoticeEditEnable = () => this.loopCheck('最新通告', EDIT_CODE);

  isInvestEditEnable = () => this.loopCheck('投资宝典', EDIT_CODE);

  isInvestViewEnable = () => this.loopCheck('投资宝典', VIEW_CODE);

  isStrategyViewEnable = () => this.loopCheck('即时策略', VIEW_CODE);

  isStrategyEditEnable = () => this.loopCheck('即时策略', EDIT_CODE);

  isScoreViewEnable = () => this.loopCheck('战绩回顾', VIEW_CODE);

  isScoreEditEnable = () => this.loopCheck('战绩回顾', EDIT_CODE);

  isCourseViewEnable = () => this.loopCheck('课程安排', VIEW_CODE);

  isCourseEditEnable = () => this.loopCheck('课程安排', EDIT_CODE);

  isRobotEnable = () => this.loopCheck('机器人马甲', EDIT_CODE);

  isChatReviewEnable = () => this.loopCheck('聊天审核', EDIT_CODE);

  isRoomAccessable = (name, roomID) => this.loopCheck(name, VIEW_CODE, roomID)

}
