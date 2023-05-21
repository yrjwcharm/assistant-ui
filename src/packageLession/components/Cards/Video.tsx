/*
 * @Date: 2022-09-21 16:41:02
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-10 18:10:54
 * @FilePath: /assistant-ui/src/packageLession/components/Cards/Video.tsx
 * @Description:  <
 */

import React, { useEffect, useRef, useState } from "react";
import Taro, { VideoContext } from "@tarojs/taro";
import { VideoProps, CommonEventFunction } from "@tarojs/components/types";
import { View, Text, Video } from "@tarojs/components";
import { INo_member_info, IMedio } from "../../types/index";
import VipCard from "./Vip";
import "./Video.less";

interface IProps extends INo_member_info, IMedio {
  title: string;
  isTry: boolean;
  tryUpLevel: (arg0: any) => void;
}

export function VideoCard(props: IProps) {
  const {
    media_url,
    media_cover,
    isTry = false,
    tryUpLevel,
    no_member_info,
    title,
  } = props;

  const [showUpLevel, setShowUpLevel] = useState(false);

  const videoRef = useRef<VideoContext | null>(null);

  useEffect(() => {
    videoRef.current = Taro.createVideoContext("video");
    let player = videoRef.current;

    return () => {
      player.stop();
    };
  }, [media_url]);

  useEffect(() => {
    if (!isTry && showUpLevel) {
      setShowUpLevel(false);
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  }, [isTry, showUpLevel]);

  const handleError = (e: any) => {
    console.log("handleError:", e);
  };
  const handleTimeUpdate: CommonEventFunction<
    VideoProps.onTimeUpdateEventDetail
  > = (e) => {
    let player = videoRef.current;

    Taro.eventCenter.trigger("process_change", {
      sum_duration: e.detail.duration,
      study_duration: e.detail.currentTime,
      is_finish: e.detail.duration - e.detail.currentTime <= 0.1 ? "1" : "0",
    });

    if (
      showUpLevel === false &&
      isTry &&
      e.detail.currentTime >= no_member_info.see_duration
    ) {
      console.log("setShowUpLevel");
      player?.pause();
      setShowUpLevel(true);
    }
  };
  const handleWaitingEventDetail = (e: any) => {
    console.log("handleWaitingEventDetailL", e);
  };
  const handleLoadedMetaDataEventDetail = () => {};

  return (
    <>
      <View className="videoCard">
        <Video
          id="video"
          title={title}
          autoplay={false}
          controls
          direction={90}
          onTimeUpdate={handleTimeUpdate}
          onError={handleError}
          vslideGestureInFullscreen
          onWaiting={handleWaitingEventDetail}
          onLoadedMetaData={handleLoadedMetaDataEventDetail}
          loop={false}
          initialTime={0}
          muted={false}
          poster={media_cover}
          // src='https://public.licaimofang.com/cms/upload/2022922/1663831322594zgan6iqd.mp4'
          src={media_url}
        >
          {/* src='https://public.licaimofang.com/cms/upload/2022930/1664529803122uwr8brxc.mp3' */}
          {/* // src='http://static.licaimofang.com/wp-content/uploads/2022/09/test_20220930.mp4' */}
        </Video>
        {showUpLevel && (
          <View className="upLevelBg">
            <Text className="endTitle">{no_member_info.see_end_title}</Text>
            <View className="endBtn" onClick={tryUpLevel}>
              <View className="tipWrap">
                <Text className="tip">
                  {no_member_info.see_end_button_keyword}
                </Text>
              </View>
              <Text className="endBtn_text">
                {no_member_info.see_end_button_title}
              </Text>
            </View>
          </View>
        )}
      </View>
      <VipCard {...props} />
    </>
  );
}

export default VideoCard;
