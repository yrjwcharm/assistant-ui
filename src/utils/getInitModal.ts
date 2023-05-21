import Taro from "@tarojs/taro";
import request from "@/utils/request";
import store from "@/config/dva";

function getModal() {
  return request(`/assistant/layer/homePop`, {
    method: "GET"
  });
}

export const getInitModal = async (params?: { pageid?: string }) => {
  try {
    const modal = await getModal();
    if (modal.is_show) {
      // 展示
      if (params?.pageid) {
        Taro.navigateTo({
          url: `/packagePage/pages/guide-page/index?pageid=${params.pageid}`
        });
      } else {
        Taro.navigateTo({
          url: `/packagePage/pages/guide-page/index`
        });
      }

      store.dispatch({
        type: "global/setGuideModal",
        payload: modal.pop_content
      });
    }
  } catch (error) {}
};
