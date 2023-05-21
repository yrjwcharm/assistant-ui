/*
 * @Date: 2023-01-03 11:15:35
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-06 17:53:38
 * @FilePath: /assistant-ui/src/config/variables.ts
 * @Description:
 */
export const down_color = "#4BA471";
export const up_color = "#E74949";

/** 买卖点信号对应的颜色 */
export const level_color: {
  [propsName: string]: {
    color: string;
    text: string;
  };
} = {
  0: {
    color: "#545968",
    text: "暂无信号",
  },
  1: {
    color: "#E74949",
    // text: "显著低估"
    text: "买入点",
  },
  2: {
    // color: "#9EC43E",
    // text: "低估"
    color: "#FF7D41",
    text: "买入区域",
  },
  3: {
    color: "#FFAF00",
    text: "持有信号",
    // text: "正常"
  },
  4: {
    // color: "#FF7D41",
    // text: "高估"
    color: "#85BC79",
    text: "卖出区域",
  },
  5: {
    color: "#4BA471",
    text: "卖出点",
    // text: "显著高估"
  },
};

export const defaultUserInfo: {
  pop_img: string[];
  member_expire: string;
  member_auto: 0 | 1;
  is_pop_out: boolean;
  is_activate: boolean;
  is_member: 0 | 1;
  is_subscribe_wechat_official: boolean;
  intro: string;
  nickname: string;
  headimgurl: string;
  customer_img: string; // 客服二维码
} = {
  nickname: "点击登录", // 昵称
  headimgurl:
    "https://static.licaimofang.com/wp-content/uploads/2022/06/assistant-defaultMiniHeadImg.png", // 头像
  customer_img:
    "https://static.licaimofang.com/wp-content/uploads/2023/03/assistant-customer-img1.png", // 客服二维码
  intro: "欢迎来到理财魔方基金理财助手",
  is_subscribe_wechat_official: false,
  is_activate: false, //
  is_member: 0, // 是否会员
  is_pop_out: false, // 是否弹窗
  member_auto: 0, // 是否自动续费
  member_expire: "", // 会员过期时间
  pop_img: [], // 弹出图片
};

export const defaultshareInfo = (path = "/pages/hold/index") => {
  return {
    // title: `您的好友${nickname}正在使用这款基金理财助手，推荐您免费体验`,
    title: "您的好友送您体验名额，大数据告诉你基金买卖点",
    path,
    imageUrl:
      "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1-share1-official_share.jpg",
  };
};

/** 来源信息 */
export const INVITER_KEY = "INVITER_KEY";

/** 非会员最多能看多久 */
export const MaxTryVideoTime = 5;
