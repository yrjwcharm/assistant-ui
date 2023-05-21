import DefaultGraph from "@/components/DefaultGraph";
import { useStoreState } from "@/hooks";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { FC, useEffect, useState } from "react";
import handIcon from "@/assets/images/icons/hand.png";
import "./index.less";
import Button from "@/components/Button";
import { TableDataType } from "../../columns";
import { toDiagnosticReport } from "../../utils/toDiagnosticReport";
import { sendPoint } from "@/utils/sendPoint";
const pageid: string = "Funddiagnosishomepage";

interface IProps {
  activeKey: "hold" | "optional";
  data: TableDataType[];
  closeGuide?: () => void;
  showGuide?: boolean;
  isDiagnosis:boolean;
}

const TabDiagnosis: FC<IProps> = ({
  data,
  activeKey,
  showGuide,
  closeGuide, isDiagnosis=true
}) => {
  const {
    global: { userType }
  } = useStoreState();

  const [listData, setListData] = useState<TableDataType[]>([]);
  const [renderPhoneAuthButton] = usePhoneAuthorization();
  // useEffect(() => {
  //   // init()
  // }, [activeKey]);

  useEffect(() => {
    setListData(data);
  }, [data]);

  const log = () => {
    sendPoint({
      pageid: pageid,
      ts: Date.now(),
      event: "click1"
    });
  };

  return (
    <View className="tab-diagnosis-container">
      {userType === "2" ? (
        listData.length > 0 ? (
          <View className="tab-diagnosis-container">
            <ScrollView scrollY className="content-scrollview">
              {showGuide ? (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    background: "rgba(0, 0, 0, 0.6)",
                    zIndex: 1
                  }}
                  onClick={closeGuide}
                />
              ) : null}
              <View className="content-container">
                {showGuide ? (
                  <View
                    className="diagnosis-guide-tips"
                    onClick={() => {
                      if (closeGuide) closeGuide();
                    }}
                  >
                    <Image src={handIcon} />
                    <View className="copywriting">以上为默认上传的基金，</View>
                    <View className="copywriting">
                      点击可看到该基金诊断详情
                    </View>
                    <View className="button">知道了</View>
                  </View>
                ) : null}

                {listData.map((item, index) => {
                  return (
                    <View
                      key={item.ra_code}
                      // style={{
                      //   position: "relative",
                      //   zIndex: 999,
                      //   background: "#fff"
                      // }}
                    >
                      <List data={item} activeKey={activeKey}  isDiagnosis={isDiagnosis}/>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            <View className="button">
              <Button
                onClick={() => {
                  if (activeKey === "hold") {
                    Taro.navigateTo({
                      url: `/packageAddFund/pages/add-fund/index?type=3`
                    });
                  } else {
                    Taro.navigateTo({
                      url: `/packageAddFund/pages/add-fund/index?type=1`
                    });
                  }

                  log();
                }}
              >
                {activeKey === "hold"
                  ? isDiagnosis?"导入持有基金查看诊断报告":'导入持有基金'
                  : isDiagnosis?"导入关注基金查看诊断报告":'导入关注基金'}
              </Button>
            </View>
          </View>
        ) : (
          <View className="no-data">
            <DefaultGraph title="暂无数据" />
            <View className="import-btn">
              <View
                style={{
                  width: "400rpx",
                  position: "relative"
                }}
              >
                <Button
                  onClick={() => {

                    if (activeKey === "hold") {
                      Taro.navigateTo({
                        url: `/packageAddFund/pages/add-fund/index?type=3`
                      });
                    } else {
                      Taro.navigateTo({
                        url: `/packageAddFund/pages/add-fund/index?type=1`
                      });
                    }
                    log();
                  }}
                >
                  {activeKey === "hold"
                    ? isDiagnosis?"导入持有基金查看诊断报告":'导入持有基金'
                    : isDiagnosis?"导入关注基金查看诊断报告":'导入关注基金'}
                </Button>
              </View>
              <Text>已支持 蚂蚁财富/天天基金平台的导入</Text>
            </View>
          </View>
        )
      ) : (
        <View className="no-data">
          <View
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Image
              src={'https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_fund_default-img.png'}
              style={{
                width: "590rpx",
                height: "418rpx"
              }}
            />
          </View>

          <View className="import-btn">
            <View
              style={{
                width: "400rpx",
                position: "relative"
              }}
            >
              <Button
                onClick={() => {

                  if (userType === "2") {
                    if (activeKey === "hold") {
                      sendPoint({
                        pageid:'diagnosticsearch',
                        ts:Date.now(),
                        event:'click1'
                      })
                      Taro.navigateTo({
                        url: `/packageAddFund/pages/add-fund/index?type=3`
                      });
                    } else {
                      sendPoint({
                        pageid:'diagnosticsearch',
                        ts:Date.now(),
                        event:'click2'
                      })
                      Taro.navigateTo({
                        url: `/packageAddFund/pages/add-fund/index?type=1`
                      });
                    }
                  }
                }}
              >
                {userType !== "2" ? renderPhoneAuthButton() : ""}
                {activeKey === "hold"
                  ? isDiagnosis?"导入持有基金查看诊断报告":'导入持有基金'
                  : isDiagnosis?"导入关注基金查看诊断报告":'导入持有基金'}
              </Button>
            </View>
            <Text>已支持 蚂蚁财富/天天基金平台的导入</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TabDiagnosis;

interface ListProps {
  data: TableDataType;
  isDiagnosis:boolean,
  activeKey: "hold" | "optional";
}

const List: FC<ListProps> = ({ data,isDiagnosis,activeKey }) => {
  return (
    <View
      className="list"
      onClick={() => {
        if (isDiagnosis) {
          activeKey=='hold'? sendPoint({
              pageid:'diagnosticsearch',
              event:'click3'
            }):sendPoint({
            pageid:'diagnosticsearch',
            event:'click4'
          })

          toDiagnosticReport(data.ra_code);
        }else {
          Taro.navigateBack({
            delta:1
          })
          Taro.eventCenter.trigger('trigger', {fund_name:data.ra_name,fund_code:data.ra_code});
        }
       }
      }
    >
      <View className="fund-info">
        <View className="fund-name">{data?.ra_name}</View>
        <View className="fund-code">{data?.ra_code}</View>
      </View>
      {isDiagnosis&&<View className="diagnosis-button">诊断</View>}
    </View>
  );
};
