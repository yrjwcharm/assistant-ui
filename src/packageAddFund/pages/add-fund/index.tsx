import { ScrollView, View, Text, Image } from "@tarojs/components";
import React, { FC, useEffect, useState } from "react";

import "./index.less";
import Taro, { useDidShow, useRouter } from "@tarojs/taro";

import helpIcon from "@/assets/images/icons/help.png";

import Button from "@/components/Button";
import { getAlbumPictures } from "@/utils/getAlbumPictures";
import { useStoreDispatch } from "@/hooks";
import { defaultInfo } from "./services";
import {Dialog,Button as DialogButton} from "@taroify/core";
const AddFund: FC = () => {
  const dispatch = useStoreDispatch();
  const [open,setOpen]=useState<boolean>(false);
  const { params } = useRouter(); // params.type: 3:持有;2:计划;1:关注; activity_id?: 活动id; schedule_id?: 期数id
  const [bannerImg, setBannerImg] = useState<string[]>([]);
  const [isUpload,setIsUpload]=useState<boolean>(true);
  const [intro, setIntro] = useState<{
    content: string;
    title: string;
  }>();
  const [listImg, setListImg] = useState<string[]>([]);
  const init = async () => {
    Taro.showLoading();
    try {
      const res = await defaultInfo({
        page: params?.type === "1" ? "optional" : "hold" // 持有:hold  关注:optional
      });
      setBannerImg(res?.bannerImg || []);
      setListImg(res?.listImg || []);
      setIntro(res?.intro || undefined);
    } catch (error) {}
    Taro.hideLoading();
  };

  const getImage = () => {
    Taro.getSystemInfoAsync({
      success(res) {
        const _params = {
          brand: res.brand, // 设备品牌
          model: res.model, // 设备型号
          system: res.system, // 操作系统及版本
          platform: res.platform // 客户端平台
        };
        getAlbumPictures({
          equipmentInfo: _params,
          params: params as any
        });
      }
    });
  };

  useDidShow(() => {
    dispatch({
      type: "fund/setFundInfo",
      payload: []
    });
  });

  useEffect(() => {
    init();
  }, []);

  return (
    <View className="add-fund">
      <ScrollView scrollY className="add-fund-scroll">
        <View
          style={{
            width: "100%"
          }}
        >
          <View className="banner-container">
            {bannerImg?.map((item, index) => {
              return (
                <Image
                  mode="widthFix"
                  className="banner-img"
                  src={item}
                  style={{
                    marginTop: index !== 0 ? "12rpx" : 0
                  }}
                />
              );
            })}
          </View>
          {intro?.title ? (
            <View
              className="page-title"
              onClick={() => {
                if (intro?.content) {
                  Taro.showModal({
                    showCancel: false,
                    confirmColor: "#0051CC",
                    confirmText: "我知道了",
                    content: intro?.content,
                    success: function(res) {
                      if (res.confirm) {
                        // console.log("用户点击确定");
                      }
                    }
                  });
                }
              }}
            >
              <Text>{intro.title}</Text>
              {intro?.content ? (
                <Image
                  style={{
                    width: "30rpx",
                    height: "30rpx",
                    marginLeft: "20rpx"
                  }}
                  src={helpIcon}
                />
              ) : null}
            </View>
          ) : null}

          <View className="content-container">
            {listImg?.map((item, index) => {
              return (
                <Image
                  mode="widthFix"
                  className="content-img"
                  src={item}
                  style={{
                    marginTop: index !== 0 ? "12rpx" : 0
                  }}
                />
              );
            })}
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20rpx",
            padding: "0 32rpx 60rpx"
          }}
        >
          <View
            style={{
              width: "400rpx",
            }}
          >
            <Button
              type='ghost'
              onClick={() => {
                setOpen(true);
                setIsUpload(false);
              }}
            >
              搜索添加基金
            </Button>
          </View>
          <View
            style={{
              width: "400rpx",
              marginLeft:'12px'
            }}
          >
            <Button type="red" onClick={()=>{
              setOpen(true);
              setIsUpload(true);
            }}>
              上传截图添加基金
            </Button>
          </View>

          {/*)}*/}
        </View>
      </ScrollView>
      <Dialog open={open} onClose={setOpen}>
        <Dialog.Content>请选择上传基金类型</Dialog.Content>
        <Dialog.Actions>
          <DialogButton style={{
            fontSize: '16px',
            fontFamily: 'PingFangSC-Regular',
            color: '#9095A5'
          }} onClick={() =>{
            params.type ='1';
            isUpload?getImage():Taro.navigateTo({
              url: "/packageAddFund/pages/search-fund/index?type=1"
            });
            console.log(isUpload,params);
            setOpen(false)
          }}>关注基金</DialogButton>
          <DialogButton style={{
            fontSize: '16px',
            fontFamily: 'PingFangSC-Medium',
            color: '#0051CC;'
          }} onClick={() => {
            params.type = '3';
            isUpload?getImage(): Taro.navigateTo({
              url: `/packageAddFund/pages/edit-fund/index?activity_id=${params?.activity_id ||
              ""}&schedule_id=${params?.schedule_id || ""}`
            })
            console.log(isUpload,params);
            setOpen(false)
          }}>持仓基金</DialogButton>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

export default AddFund;
