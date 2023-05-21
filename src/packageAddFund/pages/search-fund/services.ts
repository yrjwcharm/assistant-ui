import request from "@/utils/request";

interface SearchType {
  // type: 1 | 2 | 3; //3持有，2计划，1关注
  type: string; //3持有，2计划，1关注
  words: string; //关键词
  brand: string; //设备品牌
  model: string; //设备品牌
  system: string; //操作系统及版本
  platform: string; //客户端平台
}
// 查询
export function searchFund(data: SearchType) {
  return request("/assistant/fundManage/searchFund", {
    method: "POST",
    data
  });
}

interface IProps {
  optional_code: string[];
  upload_fund_page:string,
}
// 添加关注
export function addFund(data: IProps) {
  return request("/assistant/fundManage/addFund", {
    method: "POST",
    data: {
      type: 1,
      ...data
    }
  });
}
