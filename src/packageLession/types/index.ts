/*
 * @Date: 2023-01-06 18:01:03
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-11 14:56:55
 * @FilePath: /assistant-ui/src/packageLession/types/index.tsx
 * @Description:
 */

export interface INo_member_info {
  no_member_info: {
    introduce_button_keyword: string;
    introduce_button_title: string;
    introduce_content: string[];
    introduce_title: string;
    see_duration: number;
    see_end_button_keyword: string;
    see_end_button_title: string;
    see_end_title: string;
    see_end_title_txt: string;
  };
}

export interface IMedio {
  media_cover: string;
  media_duration: number;
  media_url: string;
}
