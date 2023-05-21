export type TSwiperItem={
   mobile:string,
   fund_name:string,
   ret:string,
   fund_code:string
}
export type TNavItem={
   tab_name:string,
   count:number,
   isActive?:boolean,
   type:string
}
export type TIntro={
  more_img:string,
  scroll_icon:string
  title: string[]
  top: string
}
export type TFundItem={
  daily_level: number
  expire_txt: string
  fund_code: string
  fund_name:string
  status: number,
  nav?:number,
  is_lock?:boolean,
  over_percent:string,
  history_percent:string,
  expire_txt_color?:string
}
export type THead={
  title:string,
  date?:string
}
type TComboItem = {
  can_unlock_info:string
  can_unlock_num_key: string
  can_unlock_num_val: string
  can_unlock_time_key: string
  can_unlock_time_val: string
  combo_id: number
  combo_name: string
  combo_time_info: string
  combo_use_time_key: string
  combo_use_time_val: string
  unlock_re_id: number,
  isActive:boolean
}
type TSubjectItem ={
  icon:string
  id: number
  text: string
}

type THeadItem ={
  desc:string
  title:string
  name:string
  updated_at:string,
  explain:string
}
type TProductHead={
  align?: string
  component_id?: string
  cover_text: string
  value: string,
  explain:string
}
type TProductItem ={
   td:{
     align?:string
     component_id: string
     cover_text: string
     is_cover: boolean
     secondary: string
     value:string
   }[]
}
