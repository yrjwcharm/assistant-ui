import Taro from "@tarojs/taro";
import request from "@/utils/request";
import store from "@/config/dva";

function getTabBar() {
  return request("/assistant/layer/tabBar", {
    method: "GET",
  });
}

export const changeTabBar = async () => {
  try {
    const res: {
      pagePath: string;
      text: string; //名称
      iconPath: string; //默认图片
      selectedIconPath: string; //选中图片
      is_red: boolean; //是否线上红点
    }[] = await getTabBar();
    // 自定义tabbar
    let _tabList:
      | (
          | {
              is_red: boolean;
              selectedIconPath: string;
              text: string;
              pagePath: string;
              iconPath: string;
            }
          | {
              is_red: boolean;
              selectedIconPath: string;
              text: string;
              pagePath: string;
              iconPath: string;
            }
        )[]
      | undefined = res?.map((item, index) => {
      const _len = Taro.getCurrentPages().length;
      const _route = Taro.getCurrentPages()[_len - 1].route;
      Taro.getCurrentPages();
      if (item.is_red && _route !== item.pagePath) {
        return {
          ...item,
          is_red: true,
        };
      } else {
        return {
          ...item,
          is_red: false,
        };
      }
    });
    // 小程序原生tabbar
    // res?.map((item, index) => {
    //   Taro.setTabBarItem({
    //     index: index,
    //     text: item.text,
    //     iconPath: item.iconPath,
    //     selectedIconPath: item.selectedIconPath
    //   });

    //   const _len = Taro.getCurrentPages().length;
    //   const _route = Taro.getCurrentPages()[_len - 1].route;

    //   // Taro.getCurrentPages();
    //   if (item.is_red && _route !== item.pagePath) {
    //     Taro.showTabBarRedDot({
    //       index: index
    //     });
    //   }
    // });

    store.dispatch({
      type: "tabBar/setTabList",
      payload: _tabList,
    });
  } catch (error) {}
  // 自定义tabbar(组件在custom-tab-bar)
  // store.dispatch({
  //   type: "tabBar/setTabList",
  //   payload: [
  //     {
  //       pagePath: "pages/index/index",
  //       text: "首页",
  //       iconPath: "../assets/images/customer-total.png",
  //       selectedIconPath: "../assets/images/loss-today.png"
  //     },
  //     {
  //       pagePath: "pages/index-copy/index",
  //       text: "首页2",
  //       iconPath: "../assets/images/new-today.png",
  //       selectedIconPath: "../assets/images/loss-today.png"
  //     }
  //   ]
  // });
  // 更改tabbar(微信原生)的图片文案小红点(缺点：不能新增/删除某个tab 不能更改tab的路径)
  // Taro.setTabBarItem({
  //   index: 0,
  //   text: "首页",
  //   iconPath: iconPath0,
  //   selectedIconPath:
  //     "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi-1.lanrentuku.com%2F2020%2F11%2F5%2Fdef6ed04-6d34-402e-99c8-366266f627dd.png%3FimageView2%2F2%2Fw%2F500&refer=http%3A%2F%2Fi-1.lanrentuku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657103613&t=3656bd95edcc7816c641239b49053d25"
  // });
  // Taro.setTabBarItem({
  //   index: 1,
  //   text: "首页2",
  //   iconPath: iconPath0,
  //   selectedIconPath: selectedIconPath0
  // });
  // Taro.showTabBarRedDot({
  //   index: 0
  // });
  // Taro.hideTabBarRedDot({
  //   index: 0
  // });
};
