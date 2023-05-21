import { FundInfoType } from "@/model/fund";
import request from "@/utils/request";
// 上传持仓(不需要报名活动)
export function addFund(data: {
  upload_fund_page: string;
  fund_data: FundInfoType[];
}) {
  return request("/assistant/fundManage/addFund", {
    method: "POST",
    data: {
      type: 3,
      ...data,
    },
  });
}

interface IProps2 {
  activity_id: string | number; //活动id
  schedule_id: string | number; //档期id
  fund_data: FundInfoType[];
}
// 上传持仓(需要报名活动)
export function inputFundInfo(data: IProps2) {
  return request("/assistant/user/activity/inputFundInfo", {
    method: "POST",
    data: {
      type: 3,
      ...data,
    },
  });
}
