import { Image, View } from "@tarojs/components";
import React from "react";
import "./index.less";
type TInvite = {
  jump: () => void;
  closeModal: () => void;
};
const InviteModal = ({ jump, closeModal }: TInvite) => {
  return (
    <View className="invite_fixed_modal">
      <View
        className="invite_modal"
        style={{
          background: `url(https://static.licaimofang.com/wp-content/uploads/2023/03/invite_combo_surprice_2.png) no-repeat`,
          backgroundSize: "cover",
        }}
      >
        <Image
          src={require("@assets/images/close_circle.png")}
          onClick={closeModal}
          className="close_circle"
        />
        <Image
          src={
            "https://static.licaimofang.com/wp-content/uploads/2022/12/assistant-noMemberPopButtonImg-1-1.png"
          }
          className="modal_btn"
          onClick={jump}
        />
      </View>
    </View>
  );
};
export default InviteModal;
