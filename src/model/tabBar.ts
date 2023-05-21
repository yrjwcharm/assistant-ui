import { Model, Effect } from "dva-core-ts";
import { Reducer } from "redux";

const buySellSignal = require("@/assets/images/tabbar-icons/buy-sell-signal.png");
const buySellSignalSelect = require("@/assets/images/tabbar-icons/buy-sell-signal-select.png");
import diagnosis from "@/assets/images/tabbar-icons/diagnosis.png";
import diagnosisSelect from "@/assets/images/tabbar-icons/diagnosis-select.png";
import fixed from "@assets/images/tabbar-icons/fixed.png";
import fixedSelect from "@assets/images/tabbar-icons/fixed-select.png";
import personal from "@/assets/images/tabbar-icons/personal.png";
import personalSelect from "@/assets/images/tabbar-icons/personal-select.png";

export interface TabBarInfoState {
  pagePath: string; // 页面路由
  text: string; // tab文案
  iconPath: string; // 未选中时的icon
  selectedIconPath: string; // 选中时的icon
  is_red: boolean; // 是否有小红点
  remark: string; // 小标签(空字符串不显示)
}
export interface TabBarState {
  tabList: TabBarInfoState[];
}

interface TabBarModel extends Model {
  namespace: "tabBar";
  state: TabBarState;
  reducers?: {
    setTabList: Reducer<TabBarState>;
  };
  effects?: {
    set?: Effect;
  };
}
const tabBarModel: TabBarModel = {
  namespace: "tabBar",
  state: {
    tabList: [
      {
        pagePath: "pages/buy-sell-signal/index",
        text: "买卖信号",
        iconPath: buySellSignal,
        selectedIconPath: buySellSignalSelect,
        is_red: false,
        remark: "",
      },
      {
        pagePath: "pages/fixed-housekeeper/index",
        text: "定投管理",
        iconPath: fixed,
        selectedIconPath: fixedSelect,
        is_red: false,
        remark: "",
      },
      {
        pagePath: "pages/fund-diagnosis-intro/index",
        text: "基金诊断",
        iconPath: diagnosis,
        selectedIconPath: diagnosisSelect,
        is_red: false,
        remark: "",
      },
      {
        pagePath: "pages/member-buy/index",
        text: "我的",
        iconPath: personal,
        selectedIconPath: personalSelect,
        is_red: false,
        remark: "",
      },
    ],
  },
  reducers: {
    setTabList(state: any, { _type, payload = true }) {
      return {
        ...state,
        tabList: payload,
      };
    },
  },
  effects: {},
};
export default tabBarModel;
