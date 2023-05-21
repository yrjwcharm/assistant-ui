import React, { FC, useCallback, useEffect, useState } from "react";
import { View, Text, Image, Button } from "@tarojs/components";
import "./index.less";
import {
  callFreeApi,
  callInviteCardInfo,
  callInviteFriendInfo,
} from "@/pages/invite-good-friend/services";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { getUserInfo } from "@/utils/getUserInfo";
import { sendPoint } from "@/utils/sendPoint";
import LoadingTip from "@/components/Loading/Loading";
type topContentInfo = {
  bg_img: string;
  info1: string;
  info2: string;
  title: string;
};
const InviteGoodFriend: FC = () => {
  const [loading, setLoading] = useState(true);
  const [headList, setHeadList] = useState([]);
  const [inviteSuccessNum, setInviteSuccessNum] = useState(0);
  const [isFocusOfficalAccount, setIsFocusOfficalAccount] = useState("");
  const [selfInviteSuccessFriendNum, setSelfInviteSuccessFriendNum] =
    useState(0);
  const [diffNum, setDiffNum] = useState(0);
  const [inviteStatus, setInviteStatus] = useState(0);
  // @ts-ignore
  const [tableHead, setTableHead] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [topContent, setTopContent] = useState<topContentInfo>({
    bg_img: "",
    info1: "",
    info2: "",
    title: "",
  });
  // @ts-ignore
  const [{ invite_img, path, title }, setInviteInfo] = useState({});
  // invite_success_user_num: 1004
  // right_content: "1年会员服务"
  const init = useCallback(() => {
    (async () => {
      const res = await callInviteFriendInfo(Taro.getStorageSync("uid"));
      const $res = await callInviteCardInfo(Taro.getStorageSync("uid"));
      const {
        own_invite_status,
        invite_success_user_head_img = [],
        own_invite_success_num,
        invite_list: { table_head = [], table_list = [] } = [],
        invite_success_user_content: { invite_success_user_num },
        top_title_txt,
        is_subscribe,
        own_goto_member_diff_num,
      } = res;
      const { invite_info } = $res;
      setTopContent(top_title_txt);
      setHeadList(invite_success_user_head_img);
      setInviteSuccessNum(inviteSuccessNum);
      setInviteSuccessNum(invite_success_user_num);
      setIsFocusOfficalAccount(is_subscribe);
      setDiffNum(own_goto_member_diff_num);
      setSelfInviteSuccessFriendNum(own_invite_success_num);
      setInviteStatus(own_invite_status);
      setTableHead(table_head);
      setInviteInfo(invite_info);
      setLoading(false);
      setTableList(table_list);
    })();
  }, []);
  useEffect(() => {
    sendPoint({
      pageid: "Invitefriends",
      // ts: ts_in_app,
      ts: Date.now(),
      event: "load",
    });
    init();
  }, []);
  // @ts-ignore

  useShareAppMessage((res) => {
    sendPoint({
      pageid: "Invitefriends",
      // ts: ts_in_app,
      ts: Date.now(),
      event: "click",
    });
    return {
      title: title,
      path: path,
      imageUrl: invite_img,
      success: function (res: any) {
        console.log("成功", res);
      },
    };
  });
  // @ts-ignore
  Taro.useShareTimeline((res: any) => {
    sendPoint({
      pageid: "Invitefriends",
      // ts: ts_in_app,
      ts: Date.now(),
      event: "click",
    });
    return {
      title: title,
      path: path,
      imageUrl: invite_img,
      success: function (res: any) {
        console.log("成功", res);
      },
    };
  });
  const updateMemberState = async () => {
    sendPoint({
      pageid: "Invitefriends",
      // ts: ts_in_app,
      ts: Date.now(),
      event: "click",
    });
    Taro.showLoading({
      title: "请稍等...",
      mask: true,
    });
    const res = await callFreeApi();
    getUserInfo();
    init();
    let timer = setTimeout(() => {
      Taro.showToast({
        title: res.message,
        icon: "none",
        duration: 3500,
      });
      timer && clearTimeout(timer);
    }, 500);
    Taro.hideLoading();
  };
  return (
    <>
      {loading ? (
        <LoadingTip />
      ) : (
        <View className="container">
          <View
            className="header"
            style={{
              background: `url(${topContent.bg_img})`,
              backgroundSize: "cover",
            }}
          >
            <View
              className="official_account"
              style={{
                background: !isFocusOfficalAccount ? "#FFF5E5" : "transparent",
              }}
            >
              {!isFocusOfficalAccount && (
                <View className="wrap">
                  <Text className="left">
                    点击关注基金理财工具公众号，实时获取邀请进度。
                  </Text>
                  <View
                    className="right"
                    onClick={() => {
                      Taro.navigateTo({
                        url: "/packagePage/pages/follow-official-account/index?back_type=1",
                      });
                    }}
                  >
                    <Text>查看</Text>
                  </View>
                </View>
              )}
            </View>
            <View className="content_wrap">
              <Text className="top_title">{topContent.title}</Text>
              <Text className="middle_title">{topContent.info1}</Text>
              <Text className="bottom_title">{topContent.info2}</Text>
            </View>
            <View className="members">
              {headList?.map((el) => {
                return <Image src={el} className="avatar" />;
              })}
              <View className="total">
                <Text>
                  共有<Text className="bold">{inviteSuccessNum}人</Text>领取成功
                </Text>
              </View>
            </View>
            <View className="invite_card">
              <View className="invite_header">
                <Image
                  src="https://static.licaimofang.com/wp-content/uploads/2023/02/invite_card.png"
                  className="invite_step"
                />
              </View>
              <View className="separator" />
              <View className="invite_persons">
                <Text className="invite_success">
                  邀请成功
                  <Text className="color">{selfInviteSuccessFriendNum}</Text>人
                </Text>
                <Text className="diff_person">
                  距离解锁套餐还差<Text className="color">{diffNum}</Text>人
                </Text>
              </View>
              {inviteStatus == 0 ? (
                <Button openType="share" className="invite_btn">
                  邀请好友
                </Button>
              ) : inviteStatus == 1 ? (
                <View className="invite_btn" onClick={updateMemberState}>
                  <Text>点此领取套餐</Text>
                </View>
              ) : (
                <View className="invite_btn" onClick={updateMemberState}>
                  <Text>领取成功</Text>
                </View>
              )}
            </View>
          </View>
          {tableList.length > 0 && (
            <View className="invite_footer">
              <Text className="title">邀请好友记录</Text>
              <View className="record_header">
                <View className="record_header_wrap">
                  <Text>{tableHead[0]?.["title"]}</Text>
                  <Text>{tableHead[1]?.["title"]}</Text>
                  <Text>{tableHead[2]?.["title"]}</Text>
                </View>
              </View>
              <View className="list_row">
                {tableList?.map((el: any, index: number) => {
                  return (
                    <View key={el + `` + index} className="list_row_item">
                      <View className="list_row_item_wrap">
                        <View className="left">
                          <Text>{el?.register_date}</Text>
                        </View>
                        <View className="center">
                          <Text>{el?.user_name}</Text>
                        </View>
                        <View className="right">
                          <Text>{el?.user_status}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};
export default InviteGoodFriend;
