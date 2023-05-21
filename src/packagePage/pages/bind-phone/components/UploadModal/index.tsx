import Taro, { getCurrentPages } from "@tarojs/taro";
import React, { FC } from "react";
import { View } from "@tarojs/components";

import "./index.less";

import { AtModal } from "taro-ui";
import { useStoreDispatch } from "@/hooks";

interface IProps {
  isOpened: boolean;
  modalData: {
    title: string; //赠送权益成功后提示标题
    content: string; //赠送权益成功后提示内容
    jump_url: string; //赠送权益成功后跳转链接
    jump_description: string; //赠送权益成功后跳转描述
  };
  user_type?: string;
}

const UploadModal: FC<IProps> = ({ isOpened, modalData, user_type }) => {
  const dispatch = useStoreDispatch();

  return (
    <AtModal isOpened={isOpened}>
      <View
        style={{
          // width: "75%",
          background: "#fff",
        }}
      >
        <View className="modal-top">
          <View>{modalData?.title}</View>
          <View>{modalData?.content}</View>
        </View>
        <View
          className="modal-btn"
          onClick={() => {
            if (user_type) {
              dispatch({
                type: "global/setUserType",
                payload: `${user_type}`,
              });
            }
            const pages = getCurrentPages();
            const pageArr = pages.reduce((prev: string[], next) => {
              prev.push(next.route ?? "");
              return prev;
            }, []);

            if (pageArr.includes("pages/hold/index")) {
              Taro.redirectTo({
                url: `/packageAddFund/pages/add-fund/index?type=3`,
              });
              return;
            }

            if (pageArr.includes("pages/optional/index")) {
              Taro.redirectTo({
                url: `/packageAddFund/pages/add-fund/index?type=1`,
              });
              return;
            }

            Taro.navigateBack();
          }}
        >
          {modalData?.jump_description}
        </View>
      </View>
    </AtModal>
  );
};

export default UploadModal;
