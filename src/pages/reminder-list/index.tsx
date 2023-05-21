import { View, Text, ScrollView } from "@tarojs/components";
import React, { FC, useEffect, useState } from "react";

import "./index.less";
import { AtLoadMore } from "taro-ui";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { messageList } from "./services";
import DefaultGraph from "@/components/DefaultGraph";
import noReminder from "@/assets/images/default-graph/no-reminder.png";
import { toSignalDetails } from "./toSignalDetails";
import { defaultshareInfo } from "@/config/variables";
const pagesize = 20;

const ReminderList: FC = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);
  const [more, setMore] = useState<boolean>(true); // 是否还有更多(true: 有更多; false: 没有更多;)
  const [moreLoading, setMoreLoading] = useState<boolean>(false); // 加载更多的loading状态
  const [list, setList] = useState<
    {
      ass_mini_content: string;
      ass_rights_id: string;
      ass_fund_code: string;
      created_at: string;
      rights_name: string;
      title_color?: string; // 标签背景色
      jump_url?: string; // 跳转页面路由
      jump_content?: string; // 跳转按钮文案
    }[]
  >([]);

  const [page, setPage] = useState<number>(1);

  const init = async (page: number) => {
    try {
      const res = await messageList({
        message_type: 0, // 消息类型 1.关注 2持有
        page: page,
        size: pagesize,
        read_type: 1, // 读取数据的类型：0:banner读取 1:点击更多读取列表
      });
      if (res.message_list.length < pagesize) {
        // 没有更多
        setMore(false);
      } else {
        setMore(true);
      }
      if (page === 1) {
        setList(res.message_list);
        if (res.message_list.length === 0) {
          setEmpty(true);
        }
      } else {
        setList([...list, ...res.message_list]);
      }
    } catch (error) {}
    setRefreshing(false);
    setMoreLoading(false);
    Taro.hideLoading();
  };

  useEffect(() => {
    if (loading) {
      Taro.showLoading({
        title: "加载中...",
      });
    } else {
      Taro.hideLoading();
    }
  }, [loading]);

  useEffect(() => {
    init(page);
  }, [page]);

  useShareAppMessage((res) => {
    return defaultshareInfo();
  });

  return (
    <ScrollView
      scrollY
      className="reminder-list-container"
      onScrollToLower={(_e) => {
        if (more) {
          const _page = page + 1;
          setMoreLoading(true);
          setPage(_page);
        }
      }}
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={() => {
        setRefreshing(true);
        if (page === 1) {
          init(1);
        } else {
          setPage(1);
        }
        // onRefresherRefresh && onRefresherRefresh()
      }}
    >
      {list.length > 0 ? (
        <View className="reminder-list">
          {list.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  paddingTop: index === 0 ? 0 : "30rpx",
                }}
              >
                <View className="time-line-title">
                  <View className="point-container">
                    <View
                      style={{
                        background: index === 0 ? "#fff" : "transparent",
                      }}
                      className="point-top"
                    />
                    <View className="point" />
                    <View style={{ flex: 1 }} />
                  </View>
                  <Text className="time">{item.created_at}</Text>
                  <Text
                    className="tag"
                    style={{
                      background: item.title_color || "#E74949",
                    }}
                  >
                    {item.rights_name}
                  </Text>
                </View>
                <View className="time-line-content">
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: item.ass_mini_content,
                    }}
                  />
                </View>
                <View className="check-btn">
                  <View
                    onClick={() => {
                      if (item.jump_url) {
                        if (
                          item.jump_url === "/pages/web-signal-details/index"
                        ) {
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
                    {item.jump_content || "查看详情"}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
      {empty ? (
        <View
          style={{
            marginTop: "200rpx",
            marginBottom: "80rpx",
            marginRight: "18rpx",
          }}
        >
          <DefaultGraph
            type="custom"
            imgSrc={noReminder}
            title="暂无买卖点提醒"
            subtitle="上传持仓/关注基金即可获得每日买卖点提醒~"
          />
        </View>
      ) : null}
      {list.length > 0 ? (
        <View className="loading-more">
          {moreLoading ? (
            <AtLoadMore status="loading" />
          ) : more ? (
            <AtLoadMore status="more" />
          ) : (
            <AtLoadMore status="noMore" />
          )}
        </View>
      ) : null}
    </ScrollView>
  );
};

export default ReminderList;
