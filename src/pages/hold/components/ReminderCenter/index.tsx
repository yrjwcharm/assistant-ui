import { View, Image, Text } from "@tarojs/components";
import React, { FC, useEffect, useState } from "react";

import { AtIcon } from "taro-ui";

import "./index.less";
import Taro, { getCurrentPages, useDidShow } from "@tarojs/taro";

// import defaultGraph from "@/assets/images/reminder-center/default-graph.png";
// @ts-ignore
import noReminder from "@/assets/images/default-graph/no-reminder.png";
// @ts-ignore
import title from "@/assets/images/reminder-center/title.png";

import { useStoreState } from "@/hooks";
import { messageList, messageRead } from "./services";
import { toSignalDetails } from "@/pages/reminder-list/toSignalDetails";
import DefaultGraph from "@/components/DefaultGraph";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
interface IProps {
  message_type?: number;
}
const ReminderCenter: FC<IProps> = () => {
  const {
    global: { userType },
  } = useStoreState();

  const [renderPhoneAuthButton] = usePhoneAuthorization();

  const [defaultImg, setDefaultImg] = useState<string>(); // 未登录状态默认图
  const [readStatus, setReadStatus] = useState<0 | 1>(1); // 0:未读(显示红点) 1:已读(不显示红点)
  const [list, setList] = useState<
    {
      ass_mini_content: string;
      ass_rights_id: string;
      ass_fund_code: string;
      created_at: string;
      rights_name: string;
      title_color?: string; // 标签背景色
      jump_url?: string; // 跳转页面路由
    }[]
  >([]);

  const [noMsg, setNoMsg] = useState<{
    child_type: string;
    content: string[];
    imgurl: string;
    title: string;
  }>();

  const init = async () => {
    try {
      const res = await messageList({
        message_type: 0, // 消息类型
        page: 1,
        size: 1,
        read_type: 0, // 读取数据的类型：0:banner读取 1:点击更多读取列表
      });
      setDefaultImg(res.img[0]);
      setReadStatus(res.read_status);
      if (res.no_msg_img) {
        setNoMsg(res.no_msg_img);
      }

      setList(res.message_list);
    } catch (error) {}
  };

  const read = async () => {
    try {
      await messageRead({
        read_status: 1,
        message_type: 0,
      });
    } catch (error) {}
  };

  useDidShow(() => {
    init();
    if (userType === "2") {
      read();
    }
  });

  useEffect(() => {
    init();
    if (userType === "2") {
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];

      if (current.route === "pages/hold/index") {
        read();
      }
    }
  }, [userType]);

  return (
    <View className="reminder-center-container">
      <View className="reminder-center-title">
        <Image
          src={title}
          style={{
            width: "134rpx",
            height: "40rpx",
          }}
        />
        {userType === "2" && list.length > 0 ? (
          <View
            className="more-reminder-btn"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/reminder-list/index`,
              });
            }}
          >
            <Text className="text">
              更多提醒
              {readStatus == 0 ? <Text className="point" /> : null}
            </Text>
            <AtIcon value="chevron-right" size="12" color="#0051CC"></AtIcon>
          </View>
        ) : null}
      </View>
      {userType === "2" && !defaultImg ? (
        <View className="reminder-list-container">
          {list.length > 0 ? (
            list.map((item, index) => {
              return (
                <View
                  key={index}
                  className="reminder-list"
                  onClick={() => {
                    if (item.jump_url) {
                      if (item.jump_url === "/pages/web-signal-details/index") {
                        toSignalDetails(item.ass_fund_code);
                      } else {
                        Taro.navigateTo({
                          url: item.jump_url,
                        });
                      }
                    } else {
                      toSignalDetails(item.ass_fund_code);
                    }
                  }}
                >
                  <View
                    className="logo"
                    style={{
                      background: item.title_color || "#E74949",
                    }}
                  >
                    {item.rights_name}
                  </View>
                  <View className="reminder-content">
                    <Text>
                      {/* 汇添富中证主要消费ETF联接A{" "}
                  <Text style={{ color: "#545968" }}>
                    短期估值-2.00显著过低
                  </Text> */}
                      <Text
                        dangerouslySetInnerHTML={{
                          __html: item.ass_mini_content,
                        }}
                      />
                    </Text>
                  </View>
                  <View>
                    <AtIcon value="chevron-right" size="12" color="#545968" />
                  </View>
                </View>
              );
            })
          ) : (
            <View
              style={{
                marginTop: "0rpx",
                marginBottom: "0rpx",
              }}
            >
              <DefaultGraph
                type="custom"
                imgSrc={noMsg?.imgurl || noReminder}
                title={noMsg?.title || ""}
                // subtitle="上传持仓/关注基金即可获得每日估值提醒~"
                // subtitle={noMsg?.content || []}
              />
            </View>
          )}
        </View>
      ) : (
        <View
          style={{
            position: "relative",
            paddingBottom: "32rpx",
            fontSize: 0,
          }}
        >
          <Image
            src={
              defaultImg ||
              "https://static.licaimofang.com/wp-content/uploads/2023/03/assistant-default-banner-1-4.png"
            }
            mode="widthFix"
            style={{
              width: "100%",
            }}
          />
          {userType !== "2" ? renderPhoneAuthButton() : null}
        </View>
      )}
    </View>
  );
};

export default ReminderCenter;
