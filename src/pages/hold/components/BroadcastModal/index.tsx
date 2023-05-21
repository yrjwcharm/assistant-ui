/* eslint-disable jsx-quotes */
import { View, Image } from "@tarojs/components";
import React, { FC } from "react";

import "./index.less";

import closeIcon from "@/assets/images/icons/close-BDC2CC.png";

// import { AtIcon } from "taro-ui";

interface IProps {
  imgUrl: string;
  visible: boolean;
  onClose?: () => any;
}

const BroadcastModal: FC<IProps> = ({ visible, imgUrl, onClose }) => {
  return (
    <View
      className="broadcast-modal-container"
      style={{
        display: visible ? "flex" : "none"
      }}
    >
      <View
        className="qrcode-container"
        style={{
          display: visible ? "flex" : "none"
        }}
      >
        <View
          className="modal-close"
          onClick={() => {
            onClose && onClose();
          }}
        >
          <Image src={closeIcon} />
        </View>
        <Image
          style={{
            width: "100%"
          }}
          mode="widthFix"
          src={imgUrl}
          // showMenuByLongpress
        />
      </View>
    </View>
  );
};

export default React.memo(BroadcastModal);
