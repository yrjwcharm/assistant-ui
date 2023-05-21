import request from "@/utils/request";

interface IProps {
  optional_code: string[];
  upload_fund_page:string
}

export function addFund(data: IProps) {
  return request("/assistant/fundManage/addFund", {
    method: "POST",
    data: {
      type: 1,
      ...data
    }
  });
}
