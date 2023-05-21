/*
 * @Date: 2023-01-30 15:04:50
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-02 17:59:50
 * @FilePath: /assistant-ui/src/pages/member-buy/base.tsx
 * @Description:
 */
import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { useStoreState } from "@/hooks";
import PageLayout from "@/components/PageLayout";
import Header from "./components/Header";
import Banner from "./components/Banner";
import BuyCard from "./components/BuyCard";
import Introduction from "./components/Introduction";
import Service from "./components/Service";
import { callGetMemberTypeInfo } from "./services";
import { IUserComboListType } from "./type";
import "./index.less";
import InviteCom from "@/pages/member-buy/components/InviteCom";
import { sendPoint } from "@/utils/sendPoint";
interface IProps {
  pageType?: "payback";
  params?: any;
}

export default function MinePage(props: IProps) {
  const {
    global: { userType },
  } = useStoreState();
  const { pageType, params } = props;
  const [expire_timestamp, setExpireTimestamp] = useState<number>(0);
  const [btnText, setBtnText] = useState<string>("");
  const [data, setData] = useState<IUserComboListType>();

  useEffect(() => {
    if (!data) return;
    sendPoint({
      pageid: "mine",
      event: "view",
      ctrl: "comb_group",
      oid: data?.user_level,
    });
  }, [data]);

  useEffect(() => {
    async function getData() {
      const result: IUserComboListType = await callGetMemberTypeInfo();
      result.combo_list = result.combo_list || [];
      setData(result);
      setExpireTimestamp(result.expire_timestamp);
      setBtnText(result.button_text);
    }
    getData();
    Taro.eventCenter.on("member-buy_update", getData);
    return () => {
      Taro.eventCenter.off("member-buy_update", getData);
    };
  }, [userType]);

  const isInTab = pageType === undefined;
  if (!data) return null;

  return (
    <PageLayout
      navConfig={{ show: isInTab, nohead: true, title: "基金理财助手" }}
      params={params}
      tabConfig={{
        show: isInTab,
        path: `pages/member-buy/${pageType === "payback" ? "pay" : "index"}`,
      }}
      isBuy={userType == "2"}
      contentClass="myContent"
    >
      <Header data={data} />
      <Banner data={data} />
      <BuyCard
        data={data}
        params={params}
        btnText={btnText}
        expire_timestamp={expire_timestamp}
      />
      <InviteCom />
      <Introduction />
      <Service />
    </PageLayout>
  );
}
