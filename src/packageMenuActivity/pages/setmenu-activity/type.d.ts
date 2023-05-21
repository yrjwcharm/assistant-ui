/*
 * @Date: 2023-01-31 14:18:43
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-28 11:41:31
 * @FilePath: /assistant-ui/src/packageMenuActivity/pages/setmenu-activity/type.d.ts
 * @Description:
 */
export interface IUserComboType {
  id: number;
  ass_type: string;
  ass_name: string;
  ass_intro: string;
  ass_price: string;
  ass_cost: string;
  ass_day: number;
  ass_lock_num: number;
  ass_lock_days: number;
  ass_tip: string;
}

/** 套餐列表借口 */
export interface IUserComboListType {
  nickname: string;
  headimgurl: string;
  can_read_num: string;
  can_lock_num: number;
  combo_num: number;
  login_status: number;
  combo_list: IUserComboType[];
}

/** 一元购落地页 */
export interface IOneBuydetail {
  status: 1 | 2;
  message: string;
  combo: IUserComboType;
  intro: {
    page_title: string;
    button_txt: string;
    button_tip: string;
  };
}
