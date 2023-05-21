import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Table from "@/components/Table";
import Taro from "@tarojs/taro";
import { Tabs } from "@taroify/core";
import { callGetCombolist } from "./services";
import { getColumns } from "./components/columns";

export default function MyCombo() {
  const [tabIndex, setTabIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);

  const [list1, setList1] = useState<any[]>();
  const [list2, setList2] = useState<any[]>();
  const [, setLoading] = useState(-1);

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "我的买卖点信号套餐",
    });
  }, []);

  const getListOwnFund = async (type: React.SetStateAction<number>) => {
    setLoading(type);
    try {
      const res = await callGetCombolist(type);
      const list = res.combo_list ?? [];
      if (type === 0) {
        setList1([...list, {}]);
      } else {
        setList2([...list, {}]);
      }
      setCount(res.can_use_num);
      setPastCount(res.expire_num);
    } catch (err) {
      console.error(err);
    }

    setLoading(-1);
    return Promise.resolve();
  };

  useEffect(() => {
    getListOwnFund(tabIndex);
  }, [tabIndex]);

  return (
    <View>
      <View>
        <Tabs
          value={tabIndex}
          onChange={setTabIndex}
          style="--tabs-line-background-color:#121D3A"
        >
          <Tabs.TabPane title={`未过期(${count})`}>
            <View style={{ overflowY: "scroll", height: "calc(100vh - 50px)" }}>
              <Table
                columns={getColumns(0)}
                data={list1 || []}
                style={{
                  zIndex: 2,
                }}
                refresh={true}
                onRefresherRefresh={() => getListOwnFund(0)}
                id="table"
              ></Table>
            </View>
          </Tabs.TabPane>
          <Tabs.TabPane title={`已过期(${pastCount})`}>
            <View style={{ overflowY: "scroll", height: "calc(100vh - 50px)" }}>
              <Table
                columns={getColumns(1)}
                data={list2 || []}
                style={{
                  zIndex: 2,
                }}
                refresh={true}
                onRefresherRefresh={() => getListOwnFund(1)}
                id="table"
              ></Table>
            </View>
          </Tabs.TabPane>
        </Tabs>
      </View>
    </View>
  );
}
