import Taro from "@tarojs/taro";
import { uploadFile } from "./uploadFile";
import store from "@/config/dva";
import { Toast } from "@/components/Toast";
interface ParamsTyps {
  name: string; // 基金名称,
  amount: string; // 持仓金额
  yield: string; // 持仓收益,
  code: string; // 基金代码
}

const saveFund = (
  params: ParamsTyps[],
  type: string | number, // type: 3:持有;2:计划;1:关注;
  query?: {
    type: string | number; // 3:持有;2:计划;1:关注;
    activity_id?: string | number; // 活动id;
    schedule_id?: string | number; // 期数id
  }
  // type: "self_select" | "external_position"
) => {
  let fund_info: {
    fund_name: string; //基金名称
    fund_code: string;
    owned_amount?: string; //持有金额
    profit?: string; //持有收益
  }[] = [];
  if (type == "3") {
    // 持有
    params?.map((item) => {
      fund_info.push({
        fund_name: item.name,
        fund_code: item.code,
        owned_amount: item.amount ? item.amount.replace(/，|,/g, "") : "",
        profit: item.yield ? item.yield.replace(/，|,/g, "") : "",
      });
    });
  } else {
    // 关注
    params?.map((item) => {
      fund_info.push({
        fund_name: item.name,
        fund_code: item.code,
      });
    });
  }

  store.dispatch({
    type: "fund/setFundInfo",
    payload: fund_info,
  });

  if (type == "3") {
    // 上传的是持有
    Taro.navigateTo({
      url: `/packageAddFund/pages/import-hold/index?activity_id=${
        query?.activity_id || ""
      }&schedule_id=${query?.schedule_id || ""}`,
    });
  } else {
    // 上传的是关注
    Taro.navigateTo({
      url: "/packageAddFund/pages/import-optional/index",
    });
  }
};

export const getAlbumPictures = (info: {
  equipmentInfo?: any; // 设备信息
  params: {
    type: string | number; // 3:持有;2:计划;1:关注;
    activity_id?: string | number; // 活动id;
    schedule_id?: string | number; // 期数id
  };
}) => {
  // type: 3:持有;2:计划;1:关注;
  Taro.chooseImage({
    count: 1, // 默认9
    sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
    // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
    sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
    success: (res) => {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      Taro.showLoading({
        title: "正在识别...",
      });
      try {
        uploadFile({
          url: "/assistant/fundManage/imgOCR",
          filePath: res.tempFilePaths[0],
          name: "file",
          // formData: params,
          callback: (params: { list: ParamsTyps[] }) => {
            Taro.hideLoading();
            let _params: ParamsTyps[] = [];
            params?.list?.map((item) => {
              if (item.code) {
                _params.push(item);
              }
            });
            if (_params.length === 0) {
              Toast.fail("识别失败，请按要求上传");
            } else {
              saveFund(_params, info.params.type, info.params);
            }
          },
        });
      } catch (error) {
        Taro.hideLoading();
      }
    },
  });
};
