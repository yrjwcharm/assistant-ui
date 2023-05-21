import { defaultUserInfo } from "@/config/variables";
import { Model, Effect } from "dva-core-ts";
import { Reducer } from "redux";

export interface GlobalState {
  type: string;
  buy_price: { origin_price: string; price: string };
  fundType: string;
  userType: string; // 用户状态 0: 未登录; 1: 信息授权登录; 2: 手机号授权登录(此时已有uid);
  userInfo: {
    headimgurl: string; // 头像
    customer_img: string; // 客服二维码
    intro: string; // 描述()
    is_activate: boolean; //
    is_member: 0 | 1; // 是否会员
    is_pop_out: boolean; // 是否弹窗
    is_subscribe_wechat_official: boolean; // 是否已经关注公众号
    member_auto: 0 | 1; // 是否自动续费
    member_expire: string; // 会员过期时间
    nickname: string; // 昵称
    pop_img: string[]; // 弹出图片
  }; // 用户信息
  guideModal: {
    pop: {
      imgurl: string; //图片链接
      content: string; //文案描述
      child_type: string;
    }[];
    pop_todo: {
      imgurl: string; //图片链接
      content: string; //文案描述
      child_type: string;
    }[];
  };
}

interface GlobalModel extends Model {
  namespace: "global";
  state: GlobalState;
  reducers?: {
    setUserType: Reducer<GlobalState>;
    setUserInfo: Reducer<GlobalState>;
    setGuideModal: Reducer<GlobalState>;
    setType: Reducer<GlobalState>;
    setFundType: Reducer<GlobalState>;
    setBuyPrice: Reducer<GlobalState>;
  };
  effects?: {
    set?: Effect;
  };
}
// @ts-ignore
const globalModel: GlobalModel = {
  namespace: "global",
  state: {
    userType: "0",
    userInfo: defaultUserInfo,
    fundType: "hold",
    guideModal: {
      pop: [],
      pop_todo: [],
    },
    type: "",
    buy_price: {
      price: "",
      origin_price: "",
    },
  },
  reducers: {
    setUserType(state: any, { _type, payload }) {
      return {
        ...state,
        userType: payload,
      };
    },
    setBuyPrice(state: GlobalState, { _type, payload }) {
      return {
        ...state,
        userType: payload,
      };
    },
    setFundType(state: GlobalState, { _type, payload }) {
      return {
        ...state,
        fundType: payload,
      };
    },
    setType(state: GlobalState, { _type, payload }) {
      return {
        ...state,
        type: payload,
      };
    },
    setUserInfo(state: GlobalState, { _type, payload }) {
      console.log("setUserInfo:", payload);
      return {
        ...state,
        userInfo: payload,
      };
    },
    setGuideModal(state: GlobalState, { _type, payload }) {
      return {
        ...state,
        guideModal: payload,
      };
    },
  },
  effects: {},
};
export default globalModel;
