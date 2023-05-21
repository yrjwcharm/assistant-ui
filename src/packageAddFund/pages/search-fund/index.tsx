import {
  ScrollView,
  View,
  Image,
  Input,
  Form,
  Button,
} from "@tarojs/components";
import React, { FC, useEffect, useRef, useState } from "react";
import "./index.less";
import Taro, { getCurrentPages, useRouter } from "@tarojs/taro";
import searchIcon from "@/assets/images/icons/search.png";

import closeIcon from "@/assets/images/icons/close-BDC2CC.png";
import SearchItem from "@/packageAddFund/components/SearchItem";

import { addFund, searchFund } from "./services";
import { Toast } from "@/components/Toast";
import { useStoreState } from "@/hooks";
import verifyRoute from "@/utils/verifyRoute";
import { toDiagnosticReport } from "@/pages/fund-diagnosis/utils/toDiagnosticReport";

let systemInfo: {
  brand: string; //设备品牌
  model: string; //设备品牌
  system: string; //操作系统及版本
  platform: string; //客户端平台
} = {
  brand: "",
  model: "",
  system: "",
  platform: "",
};

// const fundInfo = [
//   {
//     fund_code: "005686",
//     fund_name: "财通资管瑞享12个月A",
//     owned_amount: "222",
//     profit: "22"
//   }
// ];

interface fundType {
  fund_name: string; // 基金名称
  fund_code: string; // 基金代码
  year: string; // 近一年收益
  selected: 1 | 2; // 1: 关注; 2: 未关注;
}

let timer: any = null;

const SearchFund: FC = () => {
  const {
    fund: { fundInfo },
    global,
  } = useStoreState();

  const router = useRouter();

  const inputRef = useRef();

  const type = router?.params?.type || "3"; // 3: 持有; 2: 计划; 1: 关注;

  const [value, setValue] = useState<string>("");
  const [fundList, setFundList] = useState<fundType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const onInput = (e: { detail: { value: React.SetStateAction<string> } }) => {
    if (!e.detail.value) {
      setFundList([]);
    }
    setValue(e.detail.value);
    // delaySet(e.detail.value);
    // return e.detail.value;
    debounce(e.detail.value as string);

    return e.detail.value;
  };

  // const onInput = value => {
  //   setValue(value);
  //   // delaySet(e.detail.value);
  //   // return e.detail.value;
  // };

  const debounce = (value: string) => {
    // 如果已经设定过定时器就清空上一次的定时器
    if (timer) clearTimeout(timer);
    // 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
    timer = setTimeout(() => {
      if (value && value.length > 0) {
        search(value);
      }
    }, 500);
  };

  // const delaySet = useCallback(
  // debounce(value => {
  //   // setValue(value);
  //   if (value && value.length > 0) {
  //     search(value);
  //   }
  // }, 500),
  //   [value]
  // );

  // useEffect(() => {
  //   debounce(value);
  // }, [value]);

  const search = async (words: string | any[]) => {
    if (!loading) {
      // Taro.showLoading();
      setLoading(true);
      try {
        const res: fundType[] = await searchFund({
          ...systemInfo,
          words: words as string,
          type: type,
        });
        setLoading(false);
        if (fundInfo?.length) {
          const _code_arr: string[] = fundInfo.reduce(
            (prev: string[], next) => {
              prev.push(next.fund_code);
              return prev;
            },
            []
          );
          let _res: fundType[] = res.map((item) => {
            if (_code_arr.includes(item.fund_code)) {
              // 存在
              return {
                ...item,
                selected: 1, // selected: 1 | 2; // 1: 关注; 2: 未关注;
              };
            } else {
              // 不存在
              return {
                ...item,
              };
            }
          });
          setFundList(_res || []);
        } else {
          setFundList(res || []);
        }
      } catch (error) {
        setLoading(false);
      }
      // Taro. ();
    }
  };

  const selectHold = (data: fundType) => {
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.emit("acceptDataFromOpenedPage", {
      fund_name: data.fund_name,
      fund_code: data.fund_code,
    });
    Taro.navigateBack();
  };

  const selectOptional = async (data: fundType, index: number) => {
    // Taro.showLoading();
    setLoading(true);
    try {
      await addFund({
        optional_code: [data.fund_code],
        upload_fund_page: global.type,
      });
      setLoading(false);
      let _fund = fundList.concat();
      _fund[index].selected = 1;

      setFundList(_fund);

      if (verifyRoute("pages/fund-diagnosis/index")) {
        toDiagnosticReport(data.fund_code);
      }
    } catch (error) {}
    // Taro.hideLoading();
  };

  const onSelect = (data: fundType, index: number) => {
    console.log(type, global.type);
    if (type === "3") {
      // 持有
      if (data.selected == 1) {
        Toast.fail("已添加，请勿重复添加");
      } else {
        selectHold(data);
      }
    } else {
      // 关注
      if (data.selected == 1) {
        Toast.fail("已添加，请勿重复添加");
        const timer = setTimeout(() => {
          if (verifyRoute("pages/fund-diagnosis/index")) {
            toDiagnosticReport(data.fund_code);
          }
          if (timer) {
            clearTimeout(timer);
          }
        }, 1000);
      } else {
        selectOptional(data, index);
      }
    }
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
    Taro.getSystemInfoAsync({
      success(res) {
        systemInfo = {
          brand: res.brand, // 设备品牌
          model: res.model, // 设备型号
          system: res.system, // 操作系统及版本
          platform: res.platform, // 客户端平台
        };
      },
    });
  }, []);

  return (
    <View className="search-fund-container">
      <View className="search-container">
        <View className="search">
          <View>
            <View className="search-icon">
              <Image src={searchIcon} />
            </View>
            <Form
              style={{
                height: "100%",
                flex: 1,
                display: "flex",
                overflow: "hidden",
                position: "relative",
                boxSizing: "border-box",
              }}
              onReset={() => {
                setValue("");
              }}
            >
              <Input
                ref={inputRef}
                // controlled={true}
                placeholder="搜索基金名称/基金代码"
                className="input"
                // value={value}
                onInput={onInput}
                focus
                name="word"
              />
              <Button
                style={{
                  width: "max-content",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 0,
                  right: 0,
                  height: "100%",
                  padding: 0,
                }}
                formType="reset"
              >
                <View
                  className="close-icon"
                  onClick={() => {
                    setValue("");
                    setFundList([]);
                  }}
                >
                  <Image
                    src={closeIcon}
                    style={{
                      width: "40rpx",
                      height: "40rpx",
                    }}
                  />
                </View>
              </Button>
            </Form>

            {/* <AtInput
              placeholder="搜索基金名称/基金代码"
              className="input"
              value={value}
              onChange={onInput}
              name={""}
            /> */}
          </View>
        </View>
        <View
          className="search-btn"
          onClick={() => {
            if (value && value.length > 0) {
              search(value);
            }
          }}
        >
          搜索
        </View>
      </View>
      <ScrollView
        style={{
          // flex: 1,
          height: "calc(100% - 128rpx)",
          marginTop: "16rpx",
        }}
        scrollY
      >
        <View className="search-result-card">
          {/* <View className="card-name">基金</View> */}
          {fundList?.length > 0 ? (
            <View
              style={{
                paddingTop: "24rpx",
                paddingBottom: "40rpx",
              }}
            >
              {fundList?.map((item, index) => {
                return (
                  <View
                    onClick={() => {
                      onSelect(item, index);
                    }}
                  >
                    <SearchItem data={item} />
                  </View>
                );
              })}
            </View>
          ) : // <View style={{
          //   marginTop: '200rpx'
          // }}>
          //   <DefaultGraph subtitle='' />
          // </View>
          null}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchFund;
