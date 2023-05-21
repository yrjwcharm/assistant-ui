import request from "@/utils/request";
import Taro from "@tarojs/taro";
import {getLocalToken, getLocalUserType} from "@/utils/local";
import {baseURL} from '@/config';
interface IProps {
  fund_code: string[];
  type: string; // 3: 持有; 2: 计划; 1: 关注;
}
export function removeFund(data: IProps) {
  return request("/assistant/fundManage/removeFund", {
    method: "POST",
    data: {
      ...data
    }
  });
}
export type TFundListParams={
  page_type?:string
}
export const  callEditFundListApi=(params:TFundListParams)=>{
  return request(`/assistant/fund/edit/list`,{
    method:'GET',
    params
  })
}
/**
 * 删除基金接口
 * @param params
 */
export const callDelFundListApi= (params: { fund_list: { fund_code: number; type: number; }[]; })=>{
  return Taro.request({
    url:baseURL+'/assistant/fund/remove/batch',
    method:'POST',
    header:{
      'Authorization':getLocalToken()
    },
    data:{...params,user_type:getLocalUserType()}
  })
}

