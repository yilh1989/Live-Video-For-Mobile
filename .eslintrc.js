module.exports = {
  "parser": "babel-eslint",
  "rules": {
    "strict": 0,
    "no-console": 0,
    "global-require": 0,
    "jsx-a11y/href-no-hash": 0,
    "react/forbid-prop-types": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    'import/no-dynamic-require': 0,
    'max-len': ["error", 120],
  },
  "extends": "airbnb",
  "env": {
    "browser": true,
    "node": true
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  // 可自定义全局变量
  "globals": {
    "DEBUG":true,
    // ---------- 通用设置 ---------

    // 财经日历 后台接口地址单独处理，带后缀
    CALENDAR_URL: true,
    // 7x24小时 后台接口地址单独处理，带后缀
    NEWS_URL: true,
    NewsMarket: true,
    NewsCode: true,
    NewsTreeID: true,
    NewsCategoryCode: true,
    NewsOrgCode: true,
    NewsWebCode: true,

    // 后台接口服务器地址
    NORMAL_SERVER: true,

    // 通用后台接口请求路径
    COMMEN_URL: true,

    // 聊天后台接口请求路径
    CHAT_URL: true,

    // 访客用户名
    GUEST_NAME: true,

    // 访客密码
    GUEST_PWD: true,

    // 登录超时 20分钟
    LOGIN_TIME_OUT_COUNT: true,

    // 即将超时提示 15分钟 , 需小于登录超时的时间
    GOING_TIME_OUT_TIME: true,

    // 刷新token 5分钟
    REFRESH_TOKEN_TIME: true,

    // 打卡 50秒
    CHECK_TIME: true,

    // 刷新聊天记录 10秒 设置0表示关闭
    CHAT_RECORD_NEW_TIME: true,

    //定时查询审核记录 8秒 设置0表示关闭
    CHAT_RECORD_AUDIT_TIME: true,

    // 登录页面
    LOGIN_URL: true,

    // 注册页面
    REG_URL: true,

    // 视频配置
    VIDEO_CONFIG_CTX: true,

    VIDEO_CONFIG_SITE: true,

    VIDEO_CONFIG_UNAME: true,

    VIDEO_CONFIG_AUTHCODE: true,

    VIDEO_CONFIG_OWNERID: true,

  }
};
