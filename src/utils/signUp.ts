import { Toast } from "@/components/Toast";
import request from "@/utils/request";
import Taro from "@tarojs/taro";

const registration = (data: {
  activity_id: string | number | undefined;
  schedule_id: string | number | undefined;
}) => {
  return request("/assistant/user/activity/registration", {
    method: "POST",
    data,
  });
};

export const signUp = async (
  activity_id: string | number | undefined,
  schedule_id: string | number | undefined
) => {
  // console.log("signUp", activity_id, schedule_id);
  Taro.showLoading();
  try {
    const res = await registration({
      activity_id: activity_id,
      schedule_id: schedule_id,
    });
    // 0: 报名成功; 1: 已报过名; 2: 没有持仓请去添加;
    if (res.status == 0) {
      // relaod && relaod();
      Toast.info("报名成功");
      setTimeout(() => {
        Taro.navigateTo({
          url: `/packageActivity/pages/match-ranking-list/index?activity_id=${activity_id}&schedule_id=${schedule_id}`,
        });
      }, 1000);
    } else if (res.status == 1) {
      // Toast.fail("报名失败，已经参与过该活动");
    } else if (res.status == 2) {
      Taro.navigateTo({
        url: `/packageAddFund/pages/add-fund/index?type=3&activity_id=${activity_id}&schedule_id=${schedule_id}`,
      });
    }
    return res.status;
  } catch (error) {}
  Taro.hideLoading();
};
