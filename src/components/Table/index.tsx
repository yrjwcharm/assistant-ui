import { ScrollView, View, Text, Image } from "@tarojs/components";
import React, { FC, useMemo, useState } from "react";

import "./index.less";
import classNames from "classnames";

import { AtLoadMore } from "taro-ui";

import triangleSelect from "@/assets/images/icons/triangle-0051CC.png";
import triangle from "@/assets/images/icons/triangle-BDC2CC.png";

export interface ColumnsType {
  title: string;
  dataIndex: string;
  width?: number; // 默认200rpx
  align?: "left" | "center" | "right"; // 默认center
  render?: (value: any, record: any) => JSX.Element; // value: 当前值 record: 当前一条数据
  renderItem?: (value: any) => JSX.Element; // value: 当前表头数据
  sorter?: boolean; // 是否排序: 默认没有排序
  ext?: string | JSX.Element;
}

interface IProps {
  columns: ColumnsType[];
  data: any;
  id: string;
  tips?: string;
  refresh?: boolean;
  hasMore?: boolean | "noDisplay";
  pagesize?: number;
  children?: any;
  style?: React.CSSProperties;
  onRefresherRefresh?: (params?: any) => any;
  rowClick?: (item: any) => any; // 行点击事件
  showMask?: boolean; // 是否展示蒙层
}

const Table: FC<IProps> = ({
  columns = [],
  data = [],
  id,
  tips = "",
  refresh = false,
  pagesize = 0,
  hasMore = "noDisplay",
  children,
  style = {},
  showMask = false,
  onRefresherRefresh,
  rowClick,
}) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [headScrollLeft, setHeadScrollLeft] = useState<number>(0);
  const [sortKey, setSortKey] = useState<string>(); // 排序依据的key
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none"); // 排序类型(无 / 升序 / 降序)
  const tableWidth = useMemo(() => {
    const _tableWidth = columns.reduce((prev, next) => {
      let _width = next.width || 200;
      prev = prev + _width;
      return prev;
    }, 0);
    return `${_tableWidth}rpx`;
  }, [columns]);

  const tableHeight = useMemo(() => {
    return data.length * 116 + 94;
  }, [data]);

  const handleSortItem = (key: React.SetStateAction<string | undefined>) => {
    if (sortKey === key) {
      switch (sortOrder) {
        case "none":
          setSortOrder("asc");
          break;
        case "asc":
          setSortOrder("desc");
          break;
        case "desc":
          setSortOrder("none");
          setSortKey(undefined);
          break;
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const getJustifyContent = (
    align: "left" | "center" | "right" | undefined
  ) => {
    switch (align) {
      case "center":
        return "center";
      case "left":
        return "flex-start";
      case "right":
        return "flex-end";
      default:
        return "center";
    }
  };

  const sortCom = (sortOrder: "none" | "asc" | "desc") => {
    return (
      <View className="sort-com">
        <Image src={sortOrder === "asc" ? triangleSelect : triangle} />
        <Image
          style={{
            transform: "rotate(180deg)",
            marginTop: "4rpx",
          }}
          src={sortOrder === "desc" ? triangleSelect : triangle}
        />
      </View>
    );
  };

  return (
    <View
      id={id}
      style={{
        width: "100%",
        height:
          data.length > 0 ? tableHeight + 114 + "rpx" : tableHeight + "rpx",
        maxHeight: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        ...style,
      }}
    >
      <ScrollView
        style={{
          width: "100%",
          flex: "1",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        scrollY={refreshing ? false : true}
        refresherEnabled={refresh}
        refresherTriggered={refreshing}
        onRefresherRefresh={async () => {
          setRefreshing(true);
          try {
            onRefresherRefresh && (await onRefresherRefresh());
          } catch (error) {}
          setRefreshing(false);
        }}
        refresherThreshold={20}
        refresherDefaultStyle="white"
      >
        {refresh ? (
          <View
            style={{
              width: "100%",
              height: "112rpx",
              background: "#fff",
              position: "absolute",
              top: "-112rpx",
              left: 0,
              zIndex: 99,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AtLoadMore status="loading" />
          </View>
        ) : null}
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "90rpx",
              position: "absolute",
              top: 0,
              left: 0,
              background: showMask ? "rgba(0, 0, 0, 0.5)" : "transparent",
              zIndex: 101,
            }}
          />
          <ScrollView
            scrollX
            scrollLeft={headScrollLeft}
            className="table__head"
            enhanced
            bounces={false}
            showScrollbar={false}
          >
            <View
              style={{
                width: tableWidth,
                height: "100%",
                display: "flex",
              }}
            >
              {columns.map((column, columnIndex) => (
                <View
                  className="table__head__td"
                  style={{
                    width: column.width ? `${column.width}rpx` : "200rpx",
                    justifyContent: getJustifyContent(column.align),
                  }}
                  key={column.dataIndex}
                  onClick={() => {
                    if (column.sorter) {
                      handleSortItem(column.dataIndex);
                    }
                  }}
                >
                  {column.renderItem ? (
                    column.renderItem(column)
                  ) : (
                    <Text
                      className={classNames({
                        ["table__head__td__text"]: true,
                        ["table__head__td__text-active"]:
                          sortKey === column.dataIndex,
                      })}
                      key={columnIndex}
                    >
                      {column.title}
                    </Text>
                  )}

                  {column.ext ? column.ext : null}
                  {column.sorter
                    ? sortKey === column.dataIndex
                      ? sortCom(sortOrder)
                      : sortCom("none")
                    : null}
                </View>
              ))}
            </View>
          </ScrollView>
          <ScrollView
            style={{
              flex: 1,
              overflowX: "auto",
            }}
            enhanced
            bounces={false}
            showScrollbar={false}
            scrollX
            onScroll={(e) => {
              setHeadScrollLeft(parseFloat(e.detail.scrollLeft.toFixed(2)));
            }}
          >
            <View>
              {data.map(
                (
                  dataItem: { [x: string]: any },
                  dataIndex: string | number | undefined
                ) => (
                  <View
                    className={"table__row"}
                    key={dataIndex}
                    style={{ width: tableWidth }}
                    onClick={() => {
                      rowClick && rowClick(dataItem);
                    }}
                  >
                    {columns.map((attrItem, attrIndex) => {
                      if (attrItem.render) {
                        return (
                          <View
                            className={"table__row__td"}
                            key={attrItem.dataIndex}
                            style={{
                              width: attrItem.width
                                ? `${attrItem.width}rpx`
                                : "200rpx",
                            }}
                          >
                            {attrItem.render(
                              dataItem[attrItem.dataIndex],
                              dataItem
                            )}
                          </View>
                        );
                      } else {
                        return (
                          <View
                            className={"table__row__td"}
                            key={attrIndex}
                            style={{
                              width: attrItem.width
                                ? `${attrItem.width}rpx`
                                : "200rpx",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: attrItem.align || "center",
                              }}
                              className={"table__row__td__text"}
                            >
                              {dataItem[attrItem.dataIndex] || "--"}
                            </Text>
                          </View>
                        );
                      }
                    })}
                  </View>
                )
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      {children}
    </View>
  );
};

export default Table;
