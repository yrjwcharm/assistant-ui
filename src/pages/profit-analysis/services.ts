import request from "@/utils/request";

export const callProfitAnalysisList = ({
  fund_code,
  period,
}: {
  fund_code: string;
  period: string;
}) => {
  return request(
    `/assistant/v4/fundManage/user/fund/holdYield/list?fund_code=${fund_code}&period=${period}`,
    {
      method: "GET",
    }
  );
};
