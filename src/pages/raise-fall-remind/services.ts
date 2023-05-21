import request from "@/utils/request";

export const callMsgRemindSettingApi = ({
  fund_code,
}: {
  fund_code: string;
}) => {
  return request(`/assistant/v4/msgRemind/info?fund_code=${fund_code}`, {
    method: "GET",
  });
};

export const callMsgRemindSaveApi = (params: {
  fund_code: string;
  day_rise_rate_open: number;
  day_rise_rate_num: string;
  day_fall_rate_open: number;
  day_fall_rate_num: string;
  nav_rise_open: number;
  nav_rise_num: string;
  nav_fall_open: number;
  nav_fall_num: string;
  send_type: number;
  send_time: string;
  all_sync_open: number;
}) => {
  return request(`/assistant/v4/fundUpDown/click`, {
    params,
  });
};
