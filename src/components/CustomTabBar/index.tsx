import { useStoreDispatch, useStoreState } from "@/hooks";
import { TabBarInfoState } from "@/model/tabBar";
import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { FC, useEffect, useState } from "react";
import { tabbarInnerHeight, screenBottom } from "@/config/layoutSize";
export interface IProps {
  path: string;
}

// tabbar 文字颜色
const selectedColor = "#0051CC";
const color = "#4E556C";

const CustomTabBar: FC<IProps> = ({ path }) => {
  const dispatch = useStoreDispatch();
  const {
    tabBar: { tabList },
  } = useStoreState();
  const getSelect = () => {
    let _tabList: TabBarInfoState[] = tabList;
    const _index = _tabList.findIndex((item) => {
      return item.pagePath === path;
    });
    return _index;
  };

  const [selected, setSelected] = useState(-1);
  useEffect(() => {
    setSelected(getSelect());
  }, [getSelect()]);

  const switchTab = (item: TabBarInfoState, index: number) => {
    if (tabList[index].is_red) {
      let _tabList: TabBarInfoState[] = tabList.concat();
      _tabList[index].is_red = false;
      dispatch({
        type: "tabBar/setTabList",
        payload: _tabList,
      });
    }

    const url = "/" + item.pagePath;
    Taro.switchTab({
      url: url,
    });
  };

  return (
    <View
      style={{
        display: "flex",
        background: "#fff",
        borderTop: "1px solid #E9EAEF",
        fontSize: 0,
        paddingBottom: screenBottom + "px",
      }}
    >
      {tabList.map((item: TabBarInfoState, index) => {
        return (
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: tabbarInnerHeight - 1 + "px",
            }}
            onClick={() => {
              switchTab(item, index);
            }}
            data-path={item.pagePath}
            key={item.text}
          >
            <View
              style={{
                position: "relative",
              }}
            >
              {item.is_red ? (
                <View
                  style={{
                    width: "16rpx",
                    height: "16rpx",
                    background: "#E74949",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "-8rpx",
                    right: "-12rpx",
                  }}
                />
              ) : (
                false
              )}

              {item.remark ? (
                <View
                  style={{
                    paddingLeft: "6px",
                    paddingRight: "6px",
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    background: "#E74949",
                    borderRadius: "18px 18px 18px 0",
                    position: "absolute",
                    top: "-12rpx",
                    right: item.remark?.length > 4 ? "-128rpx" : "-40rpx",
                    fontSize: "22rpx",
                    color: "#FFFFFF",
                    lineHeight: "30rpx",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.remark}
                </View>
              ) : null}

              <Image
                src={selected === index ? item.selectedIconPath : item.iconPath}
                style={{
                  width: "24px",
                  height: "24px",
                }}
              />
            </View>

            <View
              style={{
                color: selected === index ? selectedColor : color,
                fontSize: "12px",
                fontWeight: "normal",
                marginTop: "2px",
              }}
            >
              {item.text}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
