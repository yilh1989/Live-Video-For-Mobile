/**
 * Created by Amg on 2016/11/2.
 */

//  ----------特殊处理------------

// pc版视频直播Web页面部署地址( 具体到文件夹，以 '/' 结尾 )
// var SINGLE_PAGE_DEP = 'http://66.66.66.52/videolive/';
var SINGLE_PAGE_DEP = 'http://120.76.249.140:85/spzbweb/';

// 财经日历 后台接口地址单独处理，带后缀
// var CALENDAR_URL = 'https://smart.dztec.net/finance/interact';
var CALENDAR_URL = 'http://120.76.249.140/finance/interact';

// 7x24小时 后台接口地址单独处理，带后缀
// var NEWS_URL = 'http://66.66.66.52:804/Service/Interact';
var NEWS_URL = 'http://120.76.249.140:8061/Service/Interact';

// 7x24小时 市场编码（可空）
var NewsMarket = '';

// 7x24小时 商品编码（可空）
var NewsCode = '';

// 7x24小时 树节点ID（可空，当TreeID为空时下面三个参数[NewsCategoryCode,NewsOrgCode,NewsWebCode]必传）
var NewsTreeID = 14;

// 7x24小时 资讯类型编码
var NewsCategoryCode = '';

// 7x24小时 Web机构编码（SHA加密后的字符串）
var NewsOrgCode = '';

// 7x24小时 平台编码
var NewsWebCode = '';

// ---------- 通用设置 ---------

// 后台接口服务器地址
// var NORMAL_SERVER = 'http://192.168.0.11';
// var NORMAL_SERVER = 'http://66.66.66.52';
var NORMAL_SERVER = 'http://120.76.249.140';

// 访客用户名
var GUEST_NAME = 'cfkd01';

// 访客密码
var GUEST_PWD = 'cfkd01';

// 通用后台接口请求路径
var COMMEN_URL = NORMAL_SERVER + '/BIService/BiServlet';

// 聊天后台接口请求路径
var CHAT_URL = NORMAL_SERVER + '/ImService/ImServlet';

// -------- 直播相关定时器时间设置 ---------

// 登录超时 20分钟 设置0表示关闭
var LOGIN_TIME_OUT_COUNT = 0;

// 即将超时提示 15分钟 , 需小于登录超时的时间
var GOING_TIME_OUT_TIME = 25 * 60;

// 刷新token 5分钟
var REFRESH_TOKEN_TIME = 5 * 60;

// 打卡 50秒
var CHECK_TIME = 50;

// 刷新聊天记录 10秒 设置0表示关闭
var CHAT_RECORD_NEW_TIME = 10;

//定时查询审核记录 8秒 设置0表示关闭
var CHAT_RECORD_AUDIT_TIME = 8;

// ---------- 用户单页面链接设置 ---------

// 登录页面
var LOGIN_URL = SINGLE_PAGE_DEP + 'login.html';

// 注册页面
var REG_URL = SINGLE_PAGE_DEP + 'reg.html';
