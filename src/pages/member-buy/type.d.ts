/*
 * @Date: 2023-01-31 14:18:43
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-01 19:46:41
 * @FilePath: /assistant-ui/src/pages/member-buy/type.d.ts
 * @Description:
 */
export interface IUserComboType {
  id: number;
  is_active: number;
  is_discount: boolean;
  ass_type: string;
  ass_name: string;
  ass_intro: string;
  ass_price: string;
  ass_cost: string;
  ass_day: number;
  ass_lock_num?: number;
  ass_lock_days?: number;
  ass_tip: string;
  ass_foot_tip: string;
}

/** 套餐列表借口 */
export interface IUserComboListType {
  nickname: string;
  vip_expire: string;
  per_day_price: string;
  headimgurl: string;
  vip_level: number;
  button_text: string;
  tag?: string;
  can_read_num: string;
  can_lock_num: number;
  combo_num: number;
  login_status: number;
  user_level: number;
  expire_timestamp: number;
  banner?: {
    img_url: string;
    is_show: 0 | 1;
    url: string;
  };
  combo_list: IUserComboType[];
}
