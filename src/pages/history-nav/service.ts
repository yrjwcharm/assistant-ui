import request from "@/utils/request";

export const callHistoryNaviApi = ({
  fund_code,
  period,
}: {
  fund_code: string;
  period: string;
}) => {
  return request(
    `/assistant/v4/fundManage/fund/history/list?fund_code=${fund_code}&period=${period}`,
    {
      method: "GET",
    }
  );
};
