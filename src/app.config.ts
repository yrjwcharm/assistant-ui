export default {
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: true, // 是否自定义tabbar
    color: "#545968",
    selectedColor: "#0051CC",
    backgroundColor: "white",
    list: [
      {
        pagePath: "pages/buy-sell-signal/index",
        text: "买卖信号",
        iconPath: "./assets/images/tabbar-icons/buy-sell-signal.png",
        selectedIconPath:
          "./assets/images/tabbar-icons/buy-sell-signal-select.png",
      },
      {
        pagePath: "pages/hold/index",
        text: "持有",
        iconPath: "./assets/images/tabbar-icons/hold.png",
        selectedIconPath: "./assets/images/tabbar-icons/hold-select.png",
      },
      {
        pagePath: "pages/fixed-housekeeper/index",
        text: "定投管家",
        iconPath: "./assets/images/tabbar-icons/fixed.png",
        selectedIconPath: "./assets/images/tabbar-icons/fixed-select.png",
      },
      {
        pagePath: "pages/fund-diagnosis-intro/index",
        text: "基金诊断",
        iconPath: "./assets/images/tabbar-icons/optional.png",
        selectedIconPath: "./assets/images/tabbar-icons/optional-select.png",
      },
      {
        pagePath: "pages/member-buy/index",
        text: "我的",
        iconPath: "./assets/images/tabbar-icons/personal.png",
        selectedIconPath: "./assets/images/tabbar-icons/personal-select.png",
      },
    ],
  },
  pages: [
    "pages/buy-sell-signal/index", // tab 买卖信号页
    "pages/excess-profit-list/index", // 基金榜单 （每日买点等）
    "pages/search-fund/index", // 基金搜索
    "pages/history-nav/index",
    "pages/raise-fall-remind/index",
    "pages/fund-details/index",
    "pages/profit-analysis/index",
    "pages/hold/index", // tab 持有关注页
    "pages/optional/index", // 关注基金 （已废弃）
    "pages/official-account/index", // 关注公众号
    "pages/family-finance-class/index", // 家庭理财课 （兼容分享）
    "pages/fund-diagnosis-intro/index", // // 基金诊断 介绍
    "pages/fund-diagnosis/index", // tab 基金诊断
    "pages/fixed-housekeeper/index", // tab 定投管理
    "pages/choose-fixed-fund/index", // 选择基金定投
    "pages/activity/index", // PK活动页
    "pages/member-buy/index", // tab 我的
    "pages/member-buy/myCombo", // 我的购买的套餐页
    "pages/member-buy/pay", // 购买页，和我的一样，用于其他页面跳转
    "pages/invite-good-friend/index", // 邀请好友
    "pages/reminder-list/index", // 提醒中心-列表页
    "pages/signal-tool/index", // 买卖点信号工具 介绍
    "pages/novice-guidance/index", // 新手引导
    "pages/web-view/index", // 小程序内嵌h5页面
    "pages/web-signal-details/index", // 买卖点信号详情(web-view)
    "pages/upgrade-activity/index", // 套餐升级活动页
  ],
  subpackages: [
    {
      // 套餐活动
      root: "packageMenuActivity",
      pages: [
        "pages/setmenu-activity/index", // 一元购活动落地页
      ],
    },
    {
      root: "packageAddFund",
      pages: [
        "pages/add-fund/index", // 导入基金(按钮)
        "pages/edit-fund/index", // 持有基金编辑(新增)
        "pages/search-fund/index", // 基金搜索
        "pages/arrange-fund/index", // 持有/关注基金编辑(删除/排序)
        "pages/import-optional/index", // 导入关注
        "pages/import-hold/index", // 导入持有
      ],
    },
    {
      root: "packagePage",
      pages: [
        "pages/follow-official-account/index", // 关注公众号
        "pages/user-agreement/index", // 用户协议
        "pages/bind-phone/index", // 绑定手机号
        "pages/guide-page/index", // 引导页
        "pages/web-diagnostic-report/index", // 基金诊断报告页(h5)
      ],
    },
    {
      root: "packageActivity",
      pages: [
        "pages/match-list/index", // 往期比赛列表
        "pages/activity-rules/index", // 活动规则
        "pages/match-fund-list/index", // 参赛基金
      ],
    },
    {
      root: "packageFissionActivity",
      pages: ["pages/fission-activity/index"], // 春节抽签活动
    },
    {
      root: "packageLession", // 家庭理财课
      pages: [
        "pages/article/index", //  课程列表
        "pages/article/detail", // 课程详情
      ],
    },
  ],
  // requiredBackgroundModes: ["audio"],
};
