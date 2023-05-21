/*
 * @Date: 2023-02-07 17:17:37
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-07 17:49:09
 * @FilePath: /assistant-ui/src/pages/hold/components/InvitGuide.tsx
 * @Description:
 */
import React, {useMemo, useState } from "react";

import Taro from "@tarojs/taro";

import { useStoreState } from "@/hooks";
import InviteModal from "@/components/inviteModal";

import { sendPoint } from "@/utils/sendPoint";

export default function InvitGuide() {
  const {
    global: {userInfo },
  } = useStoreState();

  const isPopOut = useMemo(() => {
    return userInfo.is_pop_out;
  }, [userInfo]);

  const [guide, setGuide] = useState(true);

  if (!isPopOut || !guide) return null;

  return (
    <InviteModal
      closeModal={() => {
        setGuide(false);
      }}
      jump={() => {
        setGuide(false);
        sendPoint({
          pageid: "Surprisewelfare",
          // ts: ts_in_app,
          ts: Date.now(),
          event: "click",
        });
        Taro.navigateTo({
          url: "/pages/invite-good-friend/index",
        });
      }}
    />
  );
}
