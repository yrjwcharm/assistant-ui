import React, { useEffect, useState } from "react";
import { View, Text, Image, Swiper, SwiperItem } from "@tarojs/components";
import { Divider } from "@taroify/core";
import "./index.less";
import { sendPoint } from "@/utils/sendPoint";
import { callBuyPriceApi } from "@/components/CommonModal/services";
type IProps = {
  title: string;
  bool?: boolean;
  closeModal: () => void;
  index: number;
  lookSample?: () => void;
  openMember: () => void;
};
const CommonModal = ({
  title = "",
  bool = true,
  closeModal,
  index = 0,
  lookSample,
  openMember,
}: IProps) => {
  const [item, setItem] = useState<any>({});
  const [price, setPrice] = useState<string>();
  const [listItems, setListItems] = useState([
    {
      img: "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_buy_signal.png",
      selectImg:
        "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_select_buy_signal.png",
      background:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHdpZHRoPSIzNDMiIGhlaWdodD0iNDA1Ij48cGF0aCBkPSJNMzkuODY5IDEwIDMxLjczNC42ODVhMiAyIDAgMCAwLTMuMDEzIDBMMjAuNTg2IDEwSDZxLS4xNDcgMC0uMjk0LjAwNy0uMTQ4LjAwOC0uMjk0LjAyMi0uMTQ3LjAxNC0uMjkyLjAzNi0uMTQ2LjAyMi0uMjkuMDUtLjE0NS4wMjktLjI4OC4wNjUtLjE0My4wMzYtLjI4NC4wNzgtLjE0LjA0My0uMjguMDkzLS4xMzguMDUtLjI3NC4xMDYtLjEzNi4wNTYtLjI3LjEyLS4xMzIuMDYyLS4yNjIuMTMyLS4xMy4wNjktLjI1Ny4xNDUtLjEyNi4wNzUtLjI0OC4xNTctLjEyMy4wODItLjI0MS4xNy0uMTE5LjA4OC0uMjMyLjE4LS4xMTQuMDk0LS4yMjMuMTkzLS4xMS4xLS4yMTQuMjAzLS4xMDQuMTA0LS4yMDMuMjE0LS4wOTkuMTA5LS4xOTIuMjIzLS4wOTQuMTEzLS4xODEuMjMyLS4wODguMTE4LS4xNy4yNC0uMDgyLjEyMy0uMTU3LjI1LS4wNzYuMTI2LS4xNDYuMjU2LS4wNjkuMTMtLjEzMi4yNjN0LS4xMi4yNjlxLS4wNTYuMTM2LS4xMDUuMjc1LS4wNS4xMzgtLjA5My4yOC0uMDQyLjE0LS4wNzguMjgzLS4wMzYuMTQzLS4wNjUuMjg3LS4wMjguMTQ1LS4wNS4yOS0uMDIyLjE0Ni0uMDM2LjI5My0uMDE1LjE0Ni0uMDIyLjI5NFEwIDE1Ljg1MyAwIDE2djM4M3EwIC4xNDcuMDA3LjI5NC4wMDcuMTQ4LjAyMi4yOTQuMDE0LjE0Ny4wMzYuMjkyLjAyMi4xNDYuMDUuMjkxLjAyOS4xNDQuMDY1LjI4Ny4wMzYuMTQzLjA3OC4yODQuMDQzLjE0MS4wOTMuMjc5LjA1LjEzOS4xMDYuMjc1LjA1Ni4xMzYuMTIuMjY5LjA2Mi4xMzMuMTMxLjI2My4wNy4xMy4xNDYuMjU3LjA3NS4xMjYuMTU3LjI0OC4wODIuMTIzLjE3LjI0MS4wODcuMTE4LjE4LjIzMi4wOTQuMTE0LjE5My4yMjMuMS4xMDkuMjAzLjIxNC4xMDUuMTA0LjIxNC4yMDMuMTA5LjA5OS4yMjMuMTkydC4yMzIuMTgxcS4xMTguMDg4LjI0LjE3LjEyMy4wODIuMjUuMTU3LjEyNi4wNzYuMjU2LjE0Ni4xMy4wNjkuMjYzLjEzMnQuMjY5LjExOXEuMTM2LjA1Ny4yNzUuMTA2LjEzOC4wNS4yOC4wOTMuMTQuMDQyLjI4My4wNzguMTQzLjAzNi4yODcuMDY1LjE0NS4wMjguMjkuMDUuMTQ2LjAyMi4yOTMuMDM2LjE0Ni4wMTUuMjk0LjAyMi4xNDcuMDA3LjI5NC4wMDdoMzMxcS4xNDcgMCAuMjk0LS4wMDd0LjI5NC0uMDIycS4xNDctLjAxNC4yOTItLjAzNi4xNDYtLjAyMi4yOTEtLjA1LjE0NC0uMDI5LjI4Ny0uMDY1LjE0My0uMDM2LjI4NC0uMDc4LjE0MS0uMDQzLjI3OS0uMDkzLjEzOS0uMDQ5LjI3NS0uMTA2LjEzNi0uMDU2LjI2OS0uMTE5dC4yNjMtLjEzMnEuMTMtLjA3LjI1Ny0uMTQ2LjEyNi0uMDc1LjI0OC0uMTU3LjEyMy0uMDgyLjI0MS0uMTcuMTE4LS4wODguMjMyLS4xODEuMTE0LS4wOTMuMjIzLS4xOTJ0LjIxNC0uMjAzcS4xMDQtLjEwNS4yMDMtLjIxNC4wOTktLjEwOS4xOTItLjIyM3QuMTgxLS4yMzJxLjA4OC0uMTE4LjE3LS4yNDEuMDgyLS4xMjIuMTU3LS4yNDguMDc2LS4xMjcuMTQ2LS4yNTcuMDY5LS4xMy4xMzItLjI2M3QuMTE5LS4yNjlxLjA1Ny0uMTM2LjEwNi0uMjc1LjA1LS4xMzguMDkzLS4yNzkuMDQyLS4xNDEuMDc4LS4yODR0LjA2NS0uMjg3cS4wMjgtLjE0NS4wNS0uMjkxLjAyMi0uMTQ1LjAzNi0uMjkyLjAxNS0uMTQ2LjAyMi0uMjk0LjAwNy0uMTQ3LjAwNy0uMjk0VjE2cTAtLjE0Ny0uMDA3LS4yOTR0LS4wMjItLjI5NHEtLjAxNC0uMTQ3LS4wMzYtLjI5Mi0uMDIyLS4xNDYtLjA1LS4yOS0uMDI5LS4xNDUtLjA2NS0uMjg4LS4wMzYtLjE0My0uMDc4LS4yODQtLjA0My0uMTQtLjA5My0uMjgtLjA0OS0uMTM4LS4xMDYtLjI3NC0uMDU2LS4xMzYtLjExOS0uMjctLjA2My0uMTMyLS4xMzItLjI2Mi0uMDctLjEzLS4xNDYtLjI1Ny0uMDc1LS4xMjYtLjE1Ny0uMjQ4LS4wODItLjEyMy0uMTctLjI0MS0uMDg4LS4xMTktLjE4MS0uMjMyLS4wOTMtLjExNC0uMTkyLS4yMjMtLjA5OS0uMTEtLjIwMy0uMjE0LS4xMDUtLjEwNC0uMjE0LS4yMDMtLjEwOS0uMDk5LS4yMjMtLjE5Mi0uMTE0LS4wOTQtLjIzMi0uMTgxLS4xMTgtLjA4OC0uMjQxLS4xNy0uMTIyLS4wODItLjI0OC0uMTU3LS4xMjctLjA3Ni0uMjU3LS4xNDUtLjEzLS4wNy0uMjYzLS4xMzN0LS4yNjktLjEycS0uMTM2LS4wNTYtLjI3NS0uMTA1LS4xMzgtLjA1LS4yNzktLjA5My0uMTQxLS4wNDItLjI4NC0uMDc4dC0uMjg3LS4wNjVxLS4xNDUtLjAyOC0uMjkxLS4wNS0uMTQ1LS4wMjItLjI5Mi0uMDM2LS4xNDctLjAxNC0uMjk0LS4wMjJRMzM3LjE0NyAxMCAzMzcgMTBIMzkuODY5WiIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjRkZGIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6cGFzc3Rocm91Z2giLz48L3N2Zz4=",
      explain: "买卖点信号",
      isActive: true,
      swiperHeight: "161PX",
      bannerHeight: "161PX",
      bannerList: [
        "https://static.licaimofang.com/wp-content/uploads/2023/03/buy_signal_pop-3.png",
      ],
      title: "查看基金买卖点",
      separatorWidth: "2PX",
      separatorHeight: "37PX",
      titleComponent: () => (
        <View className="nav_right">
          <Text>会买的是徒弟，会卖的是师傅。</Text>
          <Text>
            买卖点信号采用AI系统为您所关心基金，
            <Text className="bold_title">提供买卖点信</Text>
            <Text className="bold_title">号</Text>，并适时送上贴心提醒，
            <Text className="bold_title">助您低位建仓高位逃顶</Text>。
          </Text>
        </View>
      ),
    },
    {
      img: "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_fixed.png",
      selectImg:
        "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_select_fixed.png",
      background:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHdpZHRoPSIzNDMiIGhlaWdodD0iMzg4Ij48cGF0aCBkPSJNMTExLjE0MSAxMCAxMDMuMDA2LjY4NWEyIDIgMCAwIDAtMy4wMTIgMEw5MS44NTkgMTBINnEtLjE0NyAwLS4yOTQuMDA3LS4xNDguMDA4LS4yOTQuMDIyLS4xNDcuMDE0LS4yOTIuMDM2LS4xNDYuMDIyLS4yOS4wNS0uMTQ1LjAyOS0uMjg4LjA2NS0uMTQzLjAzNi0uMjg0LjA3OC0uMTQuMDQzLS4yOC4wOTMtLjEzOC4wNS0uMjc0LjEwNi0uMTM2LjA1Ni0uMjcuMTItLjEzMi4wNjItLjI2Mi4xMzItLjEzLjA2OS0uMjU3LjE0NS0uMTI2LjA3NS0uMjQ4LjE1Ny0uMTIzLjA4Mi0uMjQxLjE3LS4xMTkuMDg4LS4yMzIuMTgtLjExNC4wOTQtLjIyMy4xOTMtLjExLjEtLjIxNC4yMDMtLjEwNC4xMDQtLjIwMy4yMTQtLjA5OS4xMDktLjE5Mi4yMjMtLjA5NC4xMTMtLjE4MS4yMzItLjA4OC4xMTgtLjE3LjI0LS4wODIuMTIzLS4xNTcuMjUtLjA3Ni4xMjYtLjE0Ni4yNTYtLjA2OS4xMy0uMTMyLjI2M3QtLjEyLjI2OXEtLjA1Ni4xMzYtLjEwNS4yNzUtLjA1LjEzOC0uMDkzLjI4LS4wNDIuMTQtLjA3OC4yODMtLjAzNi4xNDMtLjA2NS4yODctLjAyOC4xNDUtLjA1LjI5LS4wMjIuMTQ2LS4wMzYuMjkzLS4wMTUuMTQ2LS4wMjIuMjk0UTAgMTUuODUzIDAgMTZ2MzY2cTAgLjE0Ny4wMDcuMjk0dC4wMjIuMjk0cS4wMTQuMTQ3LjAzNi4yOTIuMDIyLjE0Ni4wNS4yOTEuMDI5LjE0NC4wNjUuMjg3LjAzNi4xNDMuMDc4LjI4NC4wNDMuMTQxLjA5My4yNzkuMDUuMTM5LjEwNi4yNzUuMDU2LjEzNi4xMi4yNjkuMDYyLjEzMy4xMzEuMjYzLjA3LjEzLjE0Ni4yNTcuMDc1LjEyNi4xNTcuMjQ4LjA4Mi4xMjMuMTcuMjQxLjA4Ny4xMTguMTguMjMyLjA5NC4xMTQuMTkzLjIyMy4xLjEwOS4yMDMuMjE0LjEwNS4xMDQuMjE0LjIwMy4xMDkuMDk5LjIyMy4xOTIuMTE0LjA5NC4yMzIuMTgxLjExOC4wODguMjQuMTcuMTIzLjA4Mi4yNS4xNTcuMTI2LjA3Ni4yNTYuMTQ2LjEzLjA2OS4yNjMuMTMydC4yNjkuMTE5cS4xMzYuMDU3LjI3NS4xMDYuMTM4LjA1LjI4LjA5My4xNC4wNDIuMjgzLjA3OC4xNDMuMDM2LjI4Ny4wNjUuMTQ1LjAyOC4yOS4wNS4xNDYuMDIyLjI5My4wMzYuMTQ2LjAxNS4yOTQuMDIyLjE0Ny4wMDcuMjk0LjAwN2gzMzFxLjE0NyAwIC4yOTQtLjAwN3QuMjk0LS4wMjJxLjE0Ny0uMDE0LjI5Mi0uMDM2LjE0Ni0uMDIyLjI5MS0uMDUuMTQ0LS4wMjkuMjg3LS4wNjUuMTQzLS4wMzYuMjg0LS4wNzguMTQxLS4wNDMuMjc5LS4wOTMuMTM5LS4wNDkuMjc1LS4xMDYuMTM2LS4wNTYuMjY5LS4xMTl0LjI2My0uMTMycS4xMy0uMDcuMjU3LS4xNDYuMTI2LS4wNzUuMjQ4LS4xNTcuMTIzLS4wODIuMjQxLS4xNy4xMTgtLjA4Ny4yMzItLjE4MS4xMTQtLjA5My4yMjMtLjE5MnQuMjE0LS4yMDNxLjEwNC0uMTA1LjIwMy0uMjE0LjA5OS0uMTA5LjE5Mi0uMjIzdC4xODEtLjIzMnEuMDg4LS4xMTguMTctLjI0MS4wODItLjEyMi4xNTctLjI0OC4wNzYtLjEyNy4xNDYtLjI1Ny4wNjktLjEzLjEzMi0uMjYzdC4xMTktLjI2OXEuMDU3LS4xMzYuMTA2LS4yNzUuMDUtLjEzOC4wOTMtLjI3OS4wNDItLjE0MS4wNzgtLjI4NHQuMDY1LS4yODdxLjAyOC0uMTQ1LjA1LS4yOTEuMDIyLS4xNDUuMDM2LS4yOTIuMDE1LS4xNDcuMDIyLS4yOTQuMDA3LS4xNDcuMDA3LS4yOTRWMTZxMC0uMTQ3LS4wMDctLjI5NHQtLjAyMi0uMjk0cS0uMDE0LS4xNDctLjAzNi0uMjkyLS4wMjItLjE0Ni0uMDUtLjI5LS4wMjktLjE0NS0uMDY1LS4yODgtLjAzNi0uMTQzLS4wNzgtLjI4NC0uMDQzLS4xNC0uMDkzLS4yOC0uMDQ5LS4xMzgtLjEwNi0uMjc0LS4wNTYtLjEzNi0uMTE5LS4yNy0uMDYzLS4xMzItLjEzMi0uMjYyLS4wNy0uMTMtLjE0Ni0uMjU3LS4wNzUtLjEyNi0uMTU3LS4yNDgtLjA4Mi0uMTIzLS4xNy0uMjQxLS4wODgtLjExOS0uMTgxLS4yMzItLjA5My0uMTE0LS4xOTItLjIyMy0uMDk5LS4xMS0uMjAzLS4yMTQtLjEwNS0uMTA0LS4yMTQtLjIwMy0uMTA5LS4wOTktLjIyMy0uMTkyLS4xMTQtLjA5NC0uMjMyLS4xODEtLjExOC0uMDg4LS4yNDEtLjE3LS4xMjItLjA4Mi0uMjQ4LS4xNTctLjEyNy0uMDc2LS4yNTctLjE0NS0uMTMtLjA3LS4yNjMtLjEzM3QtLjI2OS0uMTJxLS4xMzYtLjA1Ni0uMjc1LS4xMDUtLjEzOC0uMDUtLjI3OS0uMDkzLS4xNDEtLjA0Mi0uMjg0LS4wNzh0LS4yODctLjA2NXEtLjE0NS0uMDI4LS4yOTEtLjA1LS4xNDUtLjAyMi0uMjkyLS4wMzYtLjE0Ny0uMDE0LS4yOTQtLjAyMlEzMzcuMTQ3IDEwIDMzNyAxMEgxMTEuMTQxWiIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjRkZGIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6cGFzc3Rocm91Z2giLz48L3N2Zz4=",
      explain: "智能定投管家",
      isActive: false,
      swiperHeight: "174PX",
      bannerHeight: "174PX",
      bannerList: [
        "https://static.licaimofang.com/wp-content/uploads/2023/02/fixed_pop.png",
      ],
      title: "定制你的定投方案",
      separatorWidth: "2PX",
      separatorHeight: "24PX",
      titleComponent: () => (
        <View className="nav_right">
          <Text>最合适的才是最好的 </Text>
          <Text>
            定投管家为您打造
            <Text className="bold_title">最适合您的定投计划</Text>。
          </Text>
        </View>
      ),
    },
    {
      img: "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_family_class.png",
      selectImg:
        "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_select_family_class.png",
      background:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHdpZHRoPSIzNDMiIGhlaWdodD0iMzg3Ij48cGF0aCBkPSJNMTgxLjg2OSAxMCAxNzMuNzM0LjY4NWEyIDIgMCAwIDAtMy4wMTMgMEwxNjIuNTg2IDEwSDZxLS4xNDcgMC0uMjk0LjAwNy0uMTQ4LjAwOC0uMjk0LjAyMi0uMTQ3LjAxNC0uMjkyLjAzNi0uMTQ2LjAyMi0uMjkuMDUtLjE0NS4wMjktLjI4OC4wNjUtLjE0My4wMzYtLjI4NC4wNzgtLjE0LjA0My0uMjguMDkzLS4xMzguMDUtLjI3NC4xMDYtLjEzNi4wNTYtLjI3LjEyLS4xMzIuMDYyLS4yNjIuMTMyLS4xMy4wNjktLjI1Ny4xNDUtLjEyNi4wNzUtLjI0OC4xNTctLjEyMy4wODItLjI0MS4xNy0uMTE5LjA4OC0uMjMyLjE4LS4xMTQuMDk0LS4yMjMuMTkzLS4xMS4xLS4yMTQuMjAzLS4xMDQuMTA0LS4yMDMuMjE0LS4wOTkuMTA5LS4xOTIuMjIzLS4wOTQuMTEzLS4xODEuMjMyLS4wODguMTE4LS4xNy4yNC0uMDgyLjEyMy0uMTU3LjI1LS4wNzYuMTI2LS4xNDYuMjU2LS4wNjkuMTMtLjEzMi4yNjN0LS4xMi4yNjlxLS4wNTYuMTM2LS4xMDUuMjc1LS4wNS4xMzgtLjA5My4yOC0uMDQyLjE0LS4wNzguMjgzLS4wMzYuMTQzLS4wNjUuMjg3LS4wMjguMTQ1LS4wNS4yOS0uMDIyLjE0Ni0uMDM2LjI5My0uMDE1LjE0Ni0uMDIyLjI5NFEwIDE1Ljg1MyAwIDE2djM2NXEwIC4xNDcuMDA3LjI5NHQuMDIyLjI5NHEuMDE0LjE0Ny4wMzYuMjkyLjAyMi4xNDYuMDUuMjkxLjAyOS4xNDQuMDY1LjI4Ny4wMzYuMTQzLjA3OC4yODQuMDQzLjE0MS4wOTMuMjc5LjA1LjEzOS4xMDYuMjc1LjA1Ni4xMzYuMTIuMjY5LjA2Mi4xMzMuMTMxLjI2My4wNy4xMy4xNDYuMjU3LjA3NS4xMjYuMTU3LjI0OC4wODIuMTIzLjE3LjI0MS4wODcuMTE5LjE4LjIzMi4wOTQuMTE0LjE5My4yMjMuMS4xMDkuMjAzLjIxNC4xMDUuMTA0LjIxNC4yMDMuMTA5LjA5OS4yMjMuMTkydC4yMzIuMTgxcS4xMTguMDg4LjI0LjE3LjEyMy4wODIuMjUuMTU3LjEyNi4wNzYuMjU2LjE0Ni4xMy4wNjkuMjYzLjEzMnQuMjY5LjExOXEuMTM2LjA1Ny4yNzUuMTA2LjEzOC4wNS4yOC4wOTMuMTQuMDQyLjI4My4wNzguMTQzLjAzNi4yODcuMDY1LjE0NS4wMjguMjkuMDUuMTQ2LjAyMi4yOTMuMDM2LjE0Ni4wMTUuMjk0LjAyMi4xNDcuMDA3LjI5NC4wMDdoMzMxcS4xNDcgMCAuMjk0LS4wMDd0LjI5NC0uMDIycS4xNDctLjAxNC4yOTItLjAzNi4xNDYtLjAyMi4yOTEtLjA1LjE0NC0uMDI5LjI4Ny0uMDY1LjE0My0uMDM2LjI4NC0uMDc4LjE0MS0uMDQzLjI3OS0uMDkzLjEzOS0uMDQ5LjI3NS0uMTA2LjEzNi0uMDU2LjI2OS0uMTE5dC4yNjMtLjEzMnEuMTMtLjA3LjI1Ny0uMTQ2LjEyNi0uMDc1LjI0OC0uMTU3LjEyMy0uMDgyLjI0MS0uMTcuMTE4LS4wODguMjMyLS4xODEuMTE0LS4wOTMuMjIzLS4xOTJ0LjIxNC0uMjAzcS4xMDQtLjEwNS4yMDMtLjIxNC4wOTktLjEwOS4xOTItLjIyMy4wOTMtLjExMy4xODEtLjIzMi4wODgtLjExOC4xNy0uMjQxLjA4Mi0uMTIyLjE1Ny0uMjQ4LjA3Ni0uMTI3LjE0Ni0uMjU3LjA2OS0uMTMuMTMyLS4yNjN0LjExOS0uMjY5cS4wNTctLjEzNi4xMDYtLjI3NS4wNS0uMTM4LjA5My0uMjc5LjA0Mi0uMTQxLjA3OC0uMjg0dC4wNjUtLjI4N3EuMDI4LS4xNDUuMDUtLjI5MS4wMjItLjE0NS4wMzYtLjI5Mi4wMTUtLjE0Ny4wMjItLjI5NC4wMDctLjE0Ny4wMDctLjI5NFYxNnEwLS4xNDctLjAwNy0uMjk0dC0uMDIyLS4yOTRxLS4wMTQtLjE0Ny0uMDM2LS4yOTItLjAyMi0uMTQ2LS4wNS0uMjktLjAyOS0uMTQ1LS4wNjUtLjI4OC0uMDM2LS4xNDMtLjA3OC0uMjg0LS4wNDMtLjE0LS4wOTMtLjI4LS4wNDktLjEzOC0uMTA2LS4yNzQtLjA1Ni0uMTM2LS4xMTktLjI3LS4wNjMtLjEzMi0uMTMyLS4yNjItLjA3LS4xMy0uMTQ2LS4yNTctLjA3NS0uMTI2LS4xNTctLjI0OC0uMDgyLS4xMjMtLjE3LS4yNDEtLjA4OC0uMTE5LS4xODEtLjIzMi0uMDkzLS4xMTQtLjE5Mi0uMjIzLS4wOTktLjExLS4yMDMtLjIxNC0uMTA1LS4xMDQtLjIxNC0uMjAzLS4xMDktLjA5OS0uMjIzLS4xOTItLjExNC0uMDk0LS4yMzItLjE4MS0uMTE4LS4wODgtLjI0MS0uMTctLjEyMi0uMDgyLS4yNDgtLjE1Ny0uMTI3LS4wNzYtLjI1Ny0uMTQ1LS4xMy0uMDctLjI2My0uMTMzdC0uMjY5LS4xMnEtLjEzNi0uMDU2LS4yNzUtLjEwNS0uMTM4LS4wNS0uMjc5LS4wOTMtLjE0MS0uMDQyLS4yODQtLjA3OHQtLjI4Ny0uMDY1cS0uMTQ1LS4wMjgtLjI5MS0uMDUtLjE0NS0uMDIyLS4yOTItLjAzNi0uMTQ3LS4wMTQtLjI5NC0uMDIyUTMzNy4xNDcgMTAgMzM3IDEwSDE4MS44NjlaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkYiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpwYXNzdGhyb3VnaCIvPjwvc3ZnPg==",
      explain: "家庭理财课程",
      isActive: false,
      swiperHeight: "174PX",
      bannerHeight: "174PX",
      bannerList: [
        "https://static.licaimofang.com/wp-content/uploads/2023/02/family_pop.png",
      ],
      title: "学习完整课程",
      separatorWidth: "2PX",
      separatorHeight: "24PX",
      titleComponent: () => (
        <View className="nav_right">
          <Text>
            <Text className="bold_title">提升您从小白到专家的投资认知</Text>
            ，您赚的每一分钱都是认识的变现。
          </Text>
        </View>
      ),
    },
    {
      img: "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_fund_report.png",
      selectImg:
        "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_select_fund_report.png",
      background:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHdpZHRoPSIzNDMiIGhlaWdodD0iNDA1Ij48cGF0aCBkPSJNMjUxLjg2OSAxMCAyNDMuNzM0LjY4NWEyIDIgMCAwIDAtMy4wMTMgMEwyMzIuNTg2IDEwSDZxLS4xNDcgMC0uMjk0LjAwNy0uMTQ4LjAwOC0uMjk0LjAyMi0uMTQ3LjAxNC0uMjkyLjAzNi0uMTQ2LjAyMi0uMjkuMDUtLjE0NS4wMjktLjI4OC4wNjUtLjE0My4wMzYtLjI4NC4wNzgtLjE0LjA0My0uMjguMDkzLS4xMzguMDUtLjI3NC4xMDYtLjEzNi4wNTYtLjI3LjEyLS4xMzIuMDYyLS4yNjIuMTMyLS4xMy4wNjktLjI1Ny4xNDUtLjEyNi4wNzUtLjI0OC4xNTctLjEyMy4wODItLjI0MS4xNy0uMTE5LjA4OC0uMjMyLjE4LS4xMTQuMDk0LS4yMjMuMTkzLS4xMS4xLS4yMTQuMjAzLS4xMDQuMTA0LS4yMDMuMjE0LS4wOTkuMTA5LS4xOTIuMjIzLS4wOTQuMTEzLS4xODEuMjMyLS4wODguMTE4LS4xNy4yNC0uMDgyLjEyMy0uMTU3LjI1LS4wNzYuMTI2LS4xNDYuMjU2LS4wNjkuMTMtLjEzMi4yNjN0LS4xMi4yNjlxLS4wNTYuMTM2LS4xMDUuMjc1LS4wNS4xMzgtLjA5My4yOC0uMDQyLjE0LS4wNzguMjgzLS4wMzYuMTQzLS4wNjUuMjg3LS4wMjguMTQ1LS4wNS4yOS0uMDIyLjE0Ni0uMDM2LjI5My0uMDE1LjE0Ni0uMDIyLjI5NFEwIDE1Ljg1MyAwIDE2djM4M3EwIC4xNDcuMDA3LjI5NC4wMDcuMTQ4LjAyMi4yOTQuMDE0LjE0Ny4wMzYuMjkyLjAyMi4xNDYuMDUuMjkxLjAyOS4xNDQuMDY1LjI4Ny4wMzYuMTQzLjA3OC4yODQuMDQzLjE0MS4wOTMuMjc5LjA1LjEzOS4xMDYuMjc1LjA1Ni4xMzYuMTIuMjY5LjA2Mi4xMzMuMTMxLjI2My4wNy4xMy4xNDYuMjU3LjA3NS4xMjYuMTU3LjI0OC4wODIuMTIzLjE3LjI0MS4wODcuMTE4LjE4LjIzMi4wOTQuMTE0LjE5My4yMjMuMS4xMDkuMjAzLjIxNC4xMDUuMTA0LjIxNC4yMDMuMTA5LjA5OS4yMjMuMTkydC4yMzIuMTgxcS4xMTguMDg4LjI0LjE3LjEyMy4wODIuMjUuMTU3LjEyNi4wNzYuMjU2LjE0Ni4xMy4wNjkuMjYzLjEzMnQuMjY5LjExOXEuMTM2LjA1Ny4yNzUuMTA2LjEzOC4wNS4yOC4wOTMuMTQuMDQyLjI4My4wNzguMTQzLjAzNi4yODcuMDY1LjE0NS4wMjguMjkuMDUuMTQ2LjAyMi4yOTMuMDM2LjE0Ni4wMTUuMjk0LjAyMi4xNDcuMDA3LjI5NC4wMDdoMzMxcS4xNDcgMCAuMjk0LS4wMDd0LjI5NC0uMDIycS4xNDctLjAxNC4yOTItLjAzNi4xNDYtLjAyMi4yOTEtLjA1LjE0NC0uMDI5LjI4Ny0uMDY1LjE0My0uMDM2LjI4NC0uMDc4LjE0MS0uMDQzLjI3OS0uMDkzLjEzOS0uMDQ5LjI3NS0uMTA2LjEzNi0uMDU2LjI2OS0uMTE5dC4yNjMtLjEzMnEuMTMtLjA3LjI1Ny0uMTQ2LjEyNi0uMDc1LjI0OC0uMTU3LjEyMy0uMDgyLjI0MS0uMTcuMTE4LS4wODguMjMyLS4xODEuMTE0LS4wOTMuMjIzLS4xOTJ0LjIxNC0uMjAzcS4xMDQtLjEwNS4yMDMtLjIxNC4wOTktLjEwOS4xOTItLjIyM3QuMTgxLS4yMzJxLjA4OC0uMTE4LjE3LS4yNDEuMDgyLS4xMjIuMTU3LS4yNDguMDc2LS4xMjcuMTQ2LS4yNTcuMDY5LS4xMy4xMzItLjI2M3QuMTE5LS4yNjlxLjA1Ny0uMTM2LjEwNi0uMjc1LjA1LS4xMzguMDkzLS4yNzkuMDQyLS4xNDEuMDc4LS4yODR0LjA2NS0uMjg3cS4wMjgtLjE0NS4wNS0uMjkxLjAyMi0uMTQ1LjAzNi0uMjkyLjAxNS0uMTQ2LjAyMi0uMjk0LjAwNy0uMTQ3LjAwNy0uMjk0VjE2cTAtLjE0Ny0uMDA3LS4yOTR0LS4wMjItLjI5NHEtLjAxNC0uMTQ3LS4wMzYtLjI5Mi0uMDIyLS4xNDYtLjA1LS4yOS0uMDI5LS4xNDUtLjA2NS0uMjg4LS4wMzYtLjE0My0uMDc4LS4yODQtLjA0My0uMTQtLjA5My0uMjgtLjA0OS0uMTM4LS4xMDYtLjI3NC0uMDU2LS4xMzYtLjExOS0uMjctLjA2My0uMTMyLS4xMzItLjI2Mi0uMDctLjEzLS4xNDYtLjI1Ny0uMDc1LS4xMjYtLjE1Ny0uMjQ4LS4wODItLjEyMy0uMTctLjI0MS0uMDg4LS4xMTktLjE4MS0uMjMyLS4wOTMtLjExNC0uMTkyLS4yMjMtLjA5OS0uMTEtLjIwMy0uMjE0LS4xMDUtLjEwNC0uMjE0LS4yMDMtLjEwOS0uMDk5LS4yMjMtLjE5Mi0uMTE0LS4wOTQtLjIzMi0uMTgxLS4xMTgtLjA4OC0uMjQxLS4xNy0uMTIyLS4wODItLjI0OC0uMTU3LS4xMjctLjA3Ni0uMjU3LS4xNDUtLjEzLS4wNy0uMjYzLS4xMzN0LS4yNjktLjEycS0uMTM2LS4wNTYtLjI3NS0uMTA1LS4xMzgtLjA1LS4yNzktLjA5My0uMTQxLS4wNDItLjI4NC0uMDc4dC0uMjg3LS4wNjVxLS4xNDUtLjAyOC0uMjkxLS4wNS0uMTQ1LS4wMjItLjI5Mi0uMDM2LS4xNDctLjAxNC0uMjk0LS4wMjJRMzM3LjE0NyAxMCAzMzcgMTBoLTg1LjEzMVoiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0ZGRiIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOnBhc3N0aHJvdWdoIi8+PC9zdmc+",
      explain: "基金投研报告",
      isActive: false,
      swiperHeight: "161PX",
      bannerHeight: "161PX",
      bannerList: [
        "https://static.licaimofang.com/wp-content/uploads/2023/02/fund_pop.png",
      ],
      title: "",
      separatorWidth: "2PX",
      separatorHeight: "37PX",
      titleComponent: () => (
        <View className="nav_right">
          <Text>
            工欲善其事，必先利其器 ！精选投研报告，为您提供全面、系统、客观的
            <Text className="bold_title">
              基金分析体系，降低您的投资失误和风险
            </Text>
            。
          </Text>
        </View>
      ),
    },
    {
      img: "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_community_group.png",
      selectImg:
        "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_select_community_group.png",
      background:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHdpZHRoPSIzNDMiIGhlaWdodD0iMjg4Ij48cGF0aCBkPSJNMzIyLjg2OSAxMCAzMTQuNzM0LjY4NWEyIDIgMCAwIDAtMy4wMTMgMEwzMDMuNTg2IDEwSDZxLS4xNDcgMC0uMjk0LjAwNy0uMTQ4LjAwOC0uMjk0LjAyMi0uMTQ3LjAxNC0uMjkyLjAzNi0uMTQ2LjAyMi0uMjkuMDUtLjE0NS4wMjktLjI4OC4wNjUtLjE0My4wMzYtLjI4NC4wNzgtLjE0LjA0My0uMjguMDkzLS4xMzguMDUtLjI3NC4xMDYtLjEzNi4wNTYtLjI3LjEyLS4xMzIuMDYyLS4yNjIuMTMyLS4xMy4wNjktLjI1Ny4xNDUtLjEyNi4wNzUtLjI0OC4xNTctLjEyMy4wODItLjI0MS4xNy0uMTE5LjA4OC0uMjMyLjE4LS4xMTQuMDk0LS4yMjMuMTkzLS4xMS4xLS4yMTQuMjAzLS4xMDQuMTA0LS4yMDMuMjE0LS4wOTkuMTA5LS4xOTIuMjIzLS4wOTQuMTEzLS4xODEuMjMyLS4wODguMTE4LS4xNy4yNC0uMDgyLjEyMy0uMTU3LjI1LS4wNzYuMTI2LS4xNDYuMjU2LS4wNjkuMTMtLjEzMi4yNjN0LS4xMi4yNjlxLS4wNTYuMTM2LS4xMDUuMjc1LS4wNS4xMzgtLjA5My4yOC0uMDQyLjE0LS4wNzguMjgzLS4wMzYuMTQzLS4wNjUuMjg3LS4wMjguMTQ1LS4wNS4yOS0uMDIyLjE0Ni0uMDM2LjI5My0uMDE1LjE0Ni0uMDIyLjI5NFEwIDE1Ljg1MyAwIDE2djI2NnEwIC4xNDcuMDA3LjI5NC4wMDcuMTQ4LjAyMi4yOTQuMDE0LjE0Ny4wMzYuMjkyLjAyMi4xNDYuMDUuMjkxLjAyOS4xNDQuMDY1LjI4Ny4wMzYuMTQzLjA3OC4yODQuMDQzLjE0MS4wOTMuMjc5LjA1LjEzOS4xMDYuMjc1LjA1Ni4xMzYuMTIuMjY5LjA2Mi4xMzMuMTMxLjI2My4wNy4xMy4xNDYuMjU3LjA3NS4xMjYuMTU3LjI0OC4wODIuMTIzLjE3LjI0MS4wODcuMTE5LjE4LjIzMi4wOTQuMTE0LjE5My4yMjMuMS4xMDkuMjAzLjIxNC4xMDUuMTA0LjIxNC4yMDMuMTA5LjA5OS4yMjMuMTkydC4yMzIuMTgxcS4xMTguMDg4LjI0LjE3LjEyMy4wODIuMjUuMTU3LjEyNi4wNzYuMjU2LjE0Ni4xMy4wNjkuMjYzLjEzMnQuMjY5LjExOXEuMTM2LjA1Ny4yNzUuMTA2LjEzOC4wNS4yOC4wOTMuMTQuMDQyLjI4My4wNzguMTQzLjAzNi4yODcuMDY1LjE0NS4wMjguMjkuMDUuMTQ2LjAyMi4yOTMuMDM2LjE0Ni4wMTUuMjk0LjAyMi4xNDcuMDA3LjI5NC4wMDdoMzMxcS4xNDcgMCAuMjk0LS4wMDd0LjI5NC0uMDIycS4xNDctLjAxNC4yOTItLjAzNi4xNDYtLjAyMi4yOTEtLjA1LjE0NC0uMDI5LjI4Ny0uMDY1LjE0My0uMDM2LjI4NC0uMDc4LjE0MS0uMDQzLjI3OS0uMDkzLjEzOS0uMDQ5LjI3NS0uMTA2LjEzNi0uMDU2LjI2OS0uMTE5dC4yNjMtLjEzMnEuMTMtLjA3LjI1Ny0uMTQ2LjEyNi0uMDc1LjI0OC0uMTU3LjEyMy0uMDgyLjI0MS0uMTcuMTE4LS4wODguMjMyLS4xODEuMTE0LS4wOTMuMjIzLS4xOTJ0LjIxNC0uMjAzcS4xMDQtLjEwNS4yMDMtLjIxNC4wOTktLjEwOS4xOTItLjIyMy4wOTMtLjExMy4xODEtLjIzMi4wODgtLjExOC4xNy0uMjQxLjA4Mi0uMTIyLjE1Ny0uMjQ4LjA3Ni0uMTI3LjE0Ni0uMjU3LjA2OS0uMTMuMTMyLS4yNjN0LjExOS0uMjY5cS4wNTctLjEzNi4xMDYtLjI3NS4wNS0uMTM4LjA5My0uMjc5LjA0Mi0uMTQxLjA3OC0uMjg0dC4wNjUtLjI4N3EuMDI4LS4xNDUuMDUtLjI5MS4wMjItLjE0NS4wMzYtLjI5Mi4wMTUtLjE0Ni4wMjItLjI5NC4wMDctLjE0Ny4wMDctLjI5NFYxNnEwLS4xNDctLjAwNy0uMjk0dC0uMDIyLS4yOTRxLS4wMTQtLjE0Ny0uMDM2LS4yOTItLjAyMi0uMTQ2LS4wNS0uMjktLjAyOS0uMTQ1LS4wNjUtLjI4OC0uMDM2LS4xNDMtLjA3OC0uMjg0LS4wNDMtLjE0LS4wOTMtLjI4LS4wNDktLjEzOC0uMTA2LS4yNzQtLjA1Ni0uMTM2LS4xMTktLjI3LS4wNjMtLjEzMi0uMTMyLS4yNjItLjA3LS4xMy0uMTQ2LS4yNTctLjA3NS0uMTI2LS4xNTctLjI0OC0uMDgyLS4xMjMtLjE3LS4yNDEtLjA4OC0uMTE5LS4xODEtLjIzMi0uMDkzLS4xMTQtLjE5Mi0uMjIzLS4wOTktLjExLS4yMDMtLjIxNC0uMTA1LS4xMDQtLjIxNC0uMjAzLS4xMDktLjA5OS0uMjIzLS4xOTItLjExNC0uMDk0LS4yMzItLjE4MS0uMTE4LS4wODgtLjI0MS0uMTctLjEyMi0uMDgyLS4yNDgtLjE1Ny0uMTI3LS4wNzYtLjI1Ny0uMTQ1LS4xMy0uMDctLjI2My0uMTMzdC0uMjY5LS4xMnEtLjEzNi0uMDU2LS4yNzUtLjEwNS0uMTM4LS4wNS0uMjc5LS4wOTMtLjE0MS0uMDQyLS4yODQtLjA3OHQtLjI4Ny0uMDY1cS0uMTQ1LS4wMjgtLjI5MS0uMDUtLjE0NS0uMDIyLS4yOTItLjAzNi0uMTQ3LS4wMTQtLjI5NC0uMDIyUTMzNy4xNDcgMTAgMzM3IDEwaC0xNC4xMzFaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkYiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpwYXNzdGhyb3VnaCIvPjwvc3ZnPg==",
      explain: "投资大咖社群",
      isActive: false,
      swiperHeight: "176PX",
      bannerHeight: "176PX",
      bannerList: [
        "https://static.licaimofang.com/wp-content/uploads/2023/02/group_pop.png",
      ],
      title: "",
      separatorWidth: "2PX",
      separatorHeight: "24PX",
      titleComponent: () => (
        <View className="nav_right">
          <Text>
            想要和更多基金投资大咖交流？想要更多基金研究干货，投资线索？都在VIP社群
          </Text>
        </View>
      ),
    },
  ]);
  useEffect(() => {
    selPrivilege(listItems[index], index);
  }, [index]);
  useEffect(() => {
    (async () => {
      /**
       * 获取弹窗底部文案
       */
      const res = await callBuyPriceApi();
      setPrice(res);
    })();
  }, []);

  const selPrivilege = (
    el: {
      img: string;
      selectImg: string;
      background: string;
      explain: string;
      isActive: boolean;
      swiperHeight: string;
      bannerHeight: string;
      bannerList: string[];
      title: string;
      separatorWidth: string;
      separatorHeight: string;
      titleComponent: () => JSX.Element;
    },
    index: number
  ) => {
    listItems.map((item) => {
      item.isActive = false;
      if (JSON.stringify(item) == JSON.stringify(el)) {
        item.isActive = true;
      }
    });
    setItem(listItems[index]);
    setListItems([...listItems]);
  };
  return (
    <View className="member_modal_container">
      <View className="member_modal_container_modal">
        <Image
          src={require("@assets/images/close_circle.png")}
          onClick={closeModal}
          className="close_circle"
        />
        <Text className="title">
          开通套餐{item["title"] ? "-" + item["title"] : ""}
        </Text>
        {bool && (
          <View className="check_sample" onClick={lookSample}>
            <Text className="txt">查看样例</Text>
            <Image
              src={require("@assets/images/arrow_right.png")}
              className="arrow_right"
            />
          </View>
        )}
        <Divider
          style={{
            margin: "16px 0",
            width: "200px",
            color: "#121D3A",
            borderColor: "#BDC2CC",
          }}
          hairline
        >
          <Text>套餐专属5大特权</Text>
        </Divider>
        {/* <Image
          src={require("@assets/images/divider.png")}
          className="divider_img"
        /> */}
        <View className="privilege_flex">
          {listItems.map((el, index) => {
            return (
              <View
                key={el + "" + index}
                className="privilege_item"
                onClick={() => selPrivilege(el, index)}
              >
                <Image
                  src={el.isActive ? el.selectImg : el.img}
                  className="img"
                />
                <Text
                  className="explain"
                  style={{
                    color: el.isActive ? "#121D3A" : "#545968",
                    fontFamily: el.isActive
                      ? "PingFangSC-Medium"
                      : "PingFangSC-Regular",
                  }}
                >
                  {el.explain}
                </Text>
              </View>
            );
          })}
        </View>
        {Object.keys(item).length > 0 && (
          <View
            className="footer_content"
            style={{
              background: `url(${item["background"]}) no-repeat`,
              backgroundSize: "cover",
            }}
          >
            <View className="nav">
              <View
                className="separator"
                style={{
                  width: item["separatorWidth"],
                  height: item["separatorHeight"],
                }}
              />
              {item["titleComponent"]?.()}
            </View>
            <Swiper
              className="swiper_carousel"
              style={{ height: item["swiperHeight"] }}
              indicatorColor="#E9EAEF"
              indicatorActiveColor="#0051CC"
              circular
              autoplay
            >
              {item["bannerList"]?.map((el: string) => {
                return (
                  <SwiperItem>
                    <Image
                      mode="aspectFill"
                      src={el}
                      className="image"
                      style={{ height: item["bannerHeight"], width: "100%" }}
                    />
                  </SwiperItem>
                );
              })}
            </Swiper>
          </View>
        )}
        <View
          className="btn"
          onClick={(e) => {
            sendPoint({
              pageid: "Purchaseguide",
              event: "click",
            });
            e.stopPropagation();
            openMember();
          }}
        >
          <Text>每天仅需{price}元，开通套餐</Text>
        </View>
      </View>
    </View>
  );
};
export default CommonModal;
